<template>
  <footer
    id="contact"
    class="bg-[#020202] text-[#b3b3b3] text-[0.9rem] border-t border-[#1a1a1a] pt-20 pb-8"
  >
    <div class="container">
      <!-- FOOTER GRID -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14"
      >
        <!-- COL 1: LOGO + DESC -->
        <div>
          <div class="mb-5">
            <Logo />
          </div>

          <p class="leading-relaxed">
            {{ $t("footer.label") }}
          </p>
        </div>

        <!-- COL 2: QUICK LINKS -->
        <div>
          <h4 class="text-white mb-6 text-[1.1rem]">Quick Links</h4>
          <ul class="space-y-3">
            <li>
              <a
                href="#services"
                class="transition-all duration-300 hover:text-[#00f7ff] hover:pl-1"
              >
                IT Solutions
              </a>
            </li>
            <li>
              <a
                href="#catalogue"
                class="transition-all duration-300 hover:text-[#00f7ff] hover:pl-1"
              >
                Product Catalogue
              </a>
            </li>
            <li>
              <a
                href="#portfolio"
                class="transition-all duration-300 hover:text-[#00f7ff] hover:pl-1"
              >
                Our Work
              </a>
            </li>
            <li>
              <a
                href="#journey"
                class="transition-all duration-300 hover:text-[#00f7ff] hover:pl-1"
              >
                About Us
              </a>
            </li>
            <li>
              <NuxtLink
                :to="$localePath('privacy-policy')"
                class="transition-all duration-300 hover:text-[#00f7ff] hover:pl-1"
              >
                {{ $t("footer.privacy_policy") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="$localePath('terms-of-services')"
                class="transition-all duration-300 hover:text-[#00f7ff] hover:pl-1"
              >
                {{ $t("footer.terms_of_service") }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- COL 3: CONTACT INFO -->
        <div>
          <h4 class="text-white mb-6 text-[1.1rem]">Contact Us</h4>

          <div class="space-y-4">
            <p class="flex items-start gap-2">
              <span class="mt-[2px]">📍</span>
              <span class="leading-relaxed">
                {{ getCompanySettings("company_address") }}
              </span>
            </p>

            <p class="flex items-start gap-2">
              <span class="mt-[2px]">✉️</span>
              <span class="leading-relaxed">
                {{ getCompanySettings("company_email") }}
              </span>
            </p>

            <p class="flex items-start gap-2">
              <span class="mt-[2px]">📞</span>
              <span class="leading-relaxed">
                {{ getCompanySettings("company_phone") }}
              </span>
            </p>
          </div>
        </div>

        <!-- COL 4: CONNECT -->
        <div>
          <h4 class="text-white mb-6 text-[1.1rem]">Connect</h4>
          <p class="leading-relaxed">Follow our journey on social media.</p>

          <div class="flex gap-4 mt-5">
            <ClientOnly>
              <UTooltip
                v-for="social in socials"
                :key="social.sm_id"
                :text="social.sm_name"
                :delay-duration="0"
              >
                <UButton
                  :to="social.sm_url"
                  target="_blank"
                  variant="link"
                  size="xl"
                  class="w-10 h-10 p-0 rounded-full border border-[#333] flex items-center justify-center transition-all duration-300 hover:border-[#00f7ff] hover:bg-[#00f7ff] hover:text-[#050505] hover:shadow-[0_0_15px_#00f7ff]"
                  :icon="social.sm_icon"
                />
              </UTooltip>
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- FOOTER BOTTOM -->
      <div class="border-t border-[#111] pt-8 text-center text-[0.8rem]">
        <p>{{ $t("footer.copyright") }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { HttpSuccessWithPagination } from "~/types/http";
import type { SocialMedia } from "~/types/marketing";

const { getCompanySettings } = useCompanySettings();
const { data: socials } = await useFetch(
  `${useRuntimeConfig().public.apiBase}/social-medias?sm_type=social_media`,
  {
    transform: (value: HttpSuccessWithPagination<SocialMedia[]>) => {
      return value.data.data;
    },
  }
);
</script>
