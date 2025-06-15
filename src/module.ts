import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';

const resolver = createResolver(import.meta.url);

export default defineNuxtModule({
  setup: (options, nuxt) => {
    nuxt.options.runtimeConfig.public.pageTitle = {
      description: options.description,
      name: options.name,
    };

    addPlugin(resolver.resolve('./runtime/plugins/plugin'));
  },
});
