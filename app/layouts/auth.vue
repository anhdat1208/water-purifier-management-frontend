<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold text-white shadow-sm">
          WP
        </div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Water Purifier</h1>
        <p class="mt-1 text-sm text-slate-500">Quản lý máy lọc nước thông minh</p>
      </div>
      <slot />
    </div>
  </div>
</template>
