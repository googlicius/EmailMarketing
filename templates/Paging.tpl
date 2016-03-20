<button class="btn" id="listViewPreviousPageButton" type="button">
	<span class="icon-chevron-left"></span>
</button>

{for $INDEX=1 to $TOTAL_PAGES}
<a class="btn paging-anchor" {if $CURRENT_PAGE eq $INDEX}disabled="disabled"{/if} data-tab="foo" data-page="{$INDEX}" id="page_{$INDEX}" href="index.php?module={$MODULE_NAME}&view=Detail&record={$RECORD}&page={$INDEX}" id="listViewPageJump{$INDEX}">{$INDEX}</a>
{/for}

<button class="btn" id="listViewNextPageButton" type="button">
	<span class="icon-chevron-right"></span>
</button>