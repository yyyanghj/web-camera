<script lang="ts">
    import { gallery } from '$lib/stores/gallery.svelte';
    import Section from '$lib/components/Section.svelte';
</script>

<div class="w-full h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
    <Section title="Edit Photo">
        <div class="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div class="w-12 h-12 border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center rounded-lg">
                <span class="text-xl text-zinc-400">?</span>
            </div>
            <p class="text-sm font-mono text-zinc-500 dark:text-zinc-400">
                Photo editing features<br>not implemented yet.
            </p>
        </div>
    </Section>
</div>
