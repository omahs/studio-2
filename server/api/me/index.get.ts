export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();

  // if (!session) {
  //   throw createError({
  //     message: 'Unauthorized',
  //     status: 401
  //   });
  // }

  return {
    user: {
      sid: session?.sessionId,
      ...session?.user
    }
  };
});