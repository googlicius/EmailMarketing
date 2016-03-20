{if !$PARENT_LIST}
<tr class="parent_row"><td colspan="{$PARENT_HEADER_LENGH}" style="text-align:center;padding-top:40px;padding-bottom:40px;font-size:18px">Không có kết quả nào</td></tr>
{else}
{foreach key=INDEX item=LINE_ITEM_DETAIL from=$PARENT_LIST}
<tr data-parentid="{$LINE_ITEM_DETAIL['parentid']}" data-parentname="{$PARENT_MODULE_NAME}" class="listViewEntries parent_row">
	<td><input type="checkbox" id="emailmarketing_{$LINE_ITEM_DETAIL['parentid']}"></td>
	{foreach key=INDEX2 item=SUB_LINE_ITEM_DETAIL from=$LINE_ITEM_DETAIL['fields']}
	<td nowrap>
		{$SUB_LINE_ITEM_DETAIL}
	</td>
	{/foreach}
</tr>
{/foreach}
{/if}