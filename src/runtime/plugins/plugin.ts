import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports';

export default defineNuxtPlugin(() => {
  const {
    public: {
      pageTitle: { name, description },
    },
  } = useRuntimeConfig();

  useHead({
    titleTemplate: pageTitle =>
      pageTitle
        ? `${pageTitle} | ${name}`
        : `${name}${description ? `: ${description}` : ''}`,
  });
});
