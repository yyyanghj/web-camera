<script lang="ts">
    import type { Snippet } from 'svelte';
    let { title, children } = $props<{ title: string, children: Snippet }>();
</script>

<div class="w-full border-b border-border-primary last:border-b-0">
    <div class="px-4 py-3 border-b border-border-primary bg-bg-primary/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 class="text-[10px] font-mono uppercase tracking-widest text-text-secondary select-none">
            {title}
        </h2>
    </div>

    <div class="p-4">
        {@render children()}
    </div>
</div>
