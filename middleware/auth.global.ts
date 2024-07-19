export default defineNuxtRouteMiddleware(async () => {
  const user = useUserState();

  const { data, error } = await useFetch("/api/me");
  if (error.value) throw createError("Failed to fetch data");

  if (data.value?.user) {
    user.value = {
      ...data.value.user
    };
  }
});