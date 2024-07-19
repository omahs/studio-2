import { ZodError } from 'zod';
import { userUpdateProfileSchema } from '~/server/schema/updateProfile';
import { v4 as uuidv4 } from 'uuid';
import { sendEmailVerification } from '~/server/utils/email';
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({
      message: 'database is not available',
      status: 500
    })
  }

  const user = await ensureAuth(event)

  const data = await readMultipartFormData(event)
  if (data === undefined || data.length === 0) {
    throw createError({
      message: 'Username and email are required',
      status: 400
    })
  }

  const username = data.find((item) => item.name === 'username')?.data.toString().toLowerCase()
  const email = data.find((item) => item.name === 'email')?.data.toString().toLowerCase()

  try {
    await userUpdateProfileSchema.parseAsync({ username, email })
  } catch (e) {
    if (e instanceof ZodError) {
      throw createError({
        message: e.issues[0].message,
        status: 400
      })
    }

    throw createError({
      message: 'Something went wrong',
      status: 500
    })
  }

  const usernameResult = await prisma.user.findFirst({
    where: {
      username
    }
  })

  if (usernameResult !== null && usernameResult?.address !== user.address) {
    throw createError({
      message: 'Username is already taken',
      status: 400
    })
  }

  const emailResult = await prisma.user.findFirst({
    where: {
      email
    }
  })

  if (emailResult !== null && emailResult?.address !== user.address) {
    throw createError({
      message: 'Email is already taken',
      status: 400
    })
  }

  let attrs: Partial<Lucia.DatabaseUserAttributes> = {
    username
  }

  // Send email confirmation
  if (email !== user.email) {
    const email_verification_token = uuidv4()
    const email_verification_token_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const email_verification_sent_at = new Date().toISOString()

    try {
      await sendEmailVerification(email!, username!, email_verification_token)
    } catch (error) {
      console.error('-----> sendEmailVerification error', error)

      throw createError({
        message: 'Failed to send email verification',
        status: 400
      })
    }

    attrs = {
      ...attrs,
      email_to_verify: email,
      email_verified: false,
      email_verified_at: null,
      email_verification_token,
      email_verification_token_expires_at,
      email_verification_sent_at
    }
  }

  try {
    const session = await auth.handleRequest(event).validate();
    if (!session) {
      throw createError({
        message: 'Unauthorized',
        status: 401
      });
    }

    const updatedUser = await auth.updateUserAttributes(user.userId, attrs)

    return {
      sid: session.sessionId,
      user: updatedUser
    }
  } catch (error) {
    throw createError({
      message: 'Something went wrong',
      status: 400
    })
  }
})