{assign var=COLUMNS value=count($PARENT_HEADER)+3}
<form action="index.php" id="search_form" method="get">
<table class="table mergeTables EmailMarketingTalble" style="margin-top:-18px">
    <thead>
    	<th colspan = "{$COLUMNS}" class="detailViewBlockHeader">
    		{vtranslate('List of', $MODULE_NAME)} {vtranslate($PARENT_MODULE_NAME, $MODULE_NAME)}
    	</th>
    </thead>
    <tbody>
    	<tr>
    		<td nowrap><input type="checkbox" id="emailmarketing_checkall"></td>
    		<td nowrap>
                <strong><a href="javascript:;" class="sort_by_click" data-name="status" data-orderby="DESC">{vtranslate("Status", $PARENT_MODULE_NAME)}</a></strong>
            </td>
            <td nowrap>
    			<strong><a href="javascript:;" class="sort_by_click" data-name="access_count" data-orderby="DESC">{vtranslate("Counts", $PARENT_MODULE_NAME)}</a></strong>
	    	</td>
    		{foreach key=INDEX item=LINE_HEADER_DETAIL from=$PARENT_HEADER}
    		<td nowrap>
    			<strong><a href="javascript:;" class="sort_by_click" data-name="{$LINE_HEADER_DETAIL['name']}" data-orderby="DESC">{vtranslate($LINE_HEADER_DETAIL['label'], $PARENT_MODULE_NAME)}</a></strong>
	    	</td>
	    	{/foreach}
    	</tr>
        <tr>
    		<td></td>
    		<td>
    			<input class="search_table" type="text" data-search-key="emailmarketing_status" style="width:65px" name="emailmarketing_status">
	    	</td>
            <td>
                <input class="search_table" type="text" data-search-key="access_count" style="width:65px" name="access_count">
            </td>
    		{foreach key=INDEX item=LINE_HEADER_DETAIL from=$PARENT_HEADER}
    		<td>
    			<input class="search_table" type="text" data-search-key="{$LINE_HEADER_DETAIL['name']}" name="{$LINE_HEADER_DETAIL['name']}" style="width:auto">
	    	</td>
	    	{/foreach}
    	</tr>
    	{include file="LoadMore.tpl"|@vtemplate_path:$MODULE_NAME}
    </tbody>
</table>
<input type="submit" class="hide">
</form>