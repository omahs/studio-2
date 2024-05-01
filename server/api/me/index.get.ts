export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();

  return {
    sid: session?.sessionId ?? null,
    user: session?.user ?? null
  };
});