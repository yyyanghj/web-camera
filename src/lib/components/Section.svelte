<script lang="ts">
    let { title } = $props<{ title: string }>();
</script>

<div class="w-full border-b border-zinc-200 dark:border-zinc-800 last:border-b-0">
    <div class="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 class="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 select-none">
            {title}
        </h2>
    </div>

    <div class="p-4">
        <slot />
    </div>
</div>
