<template>
  <div
    class="container min-h-[calc(100dvh-64px)] py-16"
    @mousemove="updateRadialPosition"
  >
    <Teleport to="body">
      <div
        ref="radialRef"
        class="eclipse fixed size-[960px] pointer-events-none -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
      ></div>
    </Teleport>

    <!-- PAGE HEADER (match product.html) -->
    <header class="page-header">
      <div class="page-header-inner">
        <h1 class="page-title">Produk Kami</h1>
        <p class="page-subtitle">
          Jelajahi kategori produk dan layanan kami untuk kebutuhan bisnis modern.
        </p>
      </div>
    </header>

    <!-- PRODUCT GRID (match product.html) -->
    <section class="catalogue-section">
      <div class="product-grid">
        <NuxtLink
          v-for="category in categories"
          :key="category.category_id"
          :to="$localeRoute(`/products/${category.category_name}-${category.category_id}`)"
          class="product-card"
        >
          <div class="card-img-placeholder">
            <!-- image (keeps your Image component) -->
            <Image
              :src="category.category_image"
              :alt="category.category_name"
              image-classes="card-img"
            />

            <!-- optional icon-like glow layer (visual only) -->
            <div class="product-icon" aria-hidden="true">⌁</div>
          </div>

          <div class="card-body">
            <!-- <span class="product-cat">CATEGORY</span> -->
            <h3 class="card-title">
              {{ category.category_name }}
            </h3>
            <p class="card-desc">
              Klik untuk melihat daftar produk/layanan di kategori ini.
            </p>

            <span class="btn-details">Lihat Detail</span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { categories, refreshCategories } = useCategories();
refreshCategories();

const radialRef = useTemplateRef("radialRef");

function updateRadialPosition(e: MouseEvent) {
  const el = radialRef.value as HTMLDivElement;
  if (el) {
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
  }
}
</script>

<style scoped>
/* Match product.html vibe */
:root {
  --bg-main: #050505;
  --bg-secondary: #0a0a12;
  --accent-blue: #00f7ff;
  --text-white: #ffffff;
  --text-gray: #b3b3b3;
}

/* PAGE HEADER */
.page-header {
  text-align: center;
  padding: 80px 0 50px 0;
  margin-bottom: 10px;
  background: radial-gradient(circle at center, #111 0%, #050505 70%);
  border-bottom: 1px solid rgba(0, 247, 255, 0.08);
  border-radius: 16px;
}

.page-header-inner {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-white);
  text-shadow: 0 0 20px rgba(0, 247, 255, 0.35);
  margin-bottom: 10px;
  font-weight: 700;
}

.page-subtitle {
  color: var(--text-gray);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* SECTION */
.catalogue-section {
  padding: 50px 0 100px 0;
}

/* GRID */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

/* CARD */
.product-card {
  display: block;
  background: var(--bg-secondary);
  border: 1px solid #222;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s ease;
  position: relative;
  text-decoration: none;
  color: inherit;
}

.product-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent-blue);
  box-shadow: 0 10px 40px -10px rgba(0, 247, 255, 0.2);
}

/* IMAGE / PLACEHOLDER AREA with cyber grid pattern */
.card-img-placeholder {
  height: 250px;
  background-color: #0f0f1a;

  /* Cyber Grid Pattern */
  background-image:
    linear-gradient(rgba(0, 247, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 247, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Inner Circle Glow */
.card-img-placeholder::after {
  content: "";
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: var(--accent-blue);
  filter: blur(65px);
  opacity: 0.18;
  position: absolute;
  inset: auto;
}

/* Your Image component will receive this class via image-classes */
.card-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  opacity: 0.92;
  position: relative;
  z-index: 2;
}

/* tiny cyber glyph */
.product-icon {
  position: absolute;
  z-index: 3;
  font-size: 2.6rem;
  color: #fff;
  text-shadow: 0 0 18px rgba(0, 247, 255, 0.8);
  opacity: 0.35;
  user-select: none;
}

/* BODY */
.card-body {
  padding: 30px;
}

.product-cat {
  font-size: 0.75rem;
  color: var(--accent-blue);
  margin-bottom: 10px;
  display: inline-block;
  border: 1px solid var(--accent-blue);
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-white);
  font-weight: 700;
}

.card-desc {
  color: var(--text-gray);
  font-size: 0.9rem;
  margin-bottom: 22px;
  line-height: 1.6;
}

/* BUTTON LOOK */
.btn-details {
  display: block;
  width: 100%;
  padding: 12px 0;
  text-align: center;
  background: transparent;
  border: 1px solid #333;
  color: white;
  font-size: 0.9rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: 0.3s;
  cursor: pointer;
  border-radius: 8px;
}

.product-card:hover .btn-details {
  background: var(--accent-blue);
  color: #000;
  border-color: var(--accent-blue);
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.6);
}
</style>
