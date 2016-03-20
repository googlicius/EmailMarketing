<script type="text/javascript">
	alert(0);
	var PARENT_LIST = '{ldelim}$PARENT_LIST{rdelim}';
	var PARENT_HEADER = "['Last Name', 'Company', 'Lead Source', 'Email', 'Assigned To']";
</script>
<table class="table mergeTables EmailMarketingTalble" style="margin-top:-18px">
	<thead>
		<th colspan = "{$COLUMNS}" class="detailViewBlockHeader">
    		{vtranslate('List of', $MODULE_NAME)} {vtranslate($PARENT_MODULE_NAME, $MODULE_NAME)}
    	</th>
	</thead>
	<tbody>
		<tr>
    		<td><input type="checkbox" id="emailmarketing_checkall"></td>
    		<td>
    			<strong>{vtranslate("Status", $PARENT_MODULE_NAME)}</strong>
	    	</td>
    		<td ng-repeat="LINE_HEADER_DETAIL in PARENT_HEADER">
    			<strong>{literal}{{LINE_HEADER_DETAIL}}{/literal}</strong>
	    	</td>
    	</tr>
    	<tr>
    		<td></td>
    		<td>
    			<input type="text" ng-model="searchStatus" style="width:38px">
	    	</td>
    		<td ng-repeat="LINE_HEADER_DETAIL in PARENT_HEADER">
    			<input type="text" ng-model="search" style="width:auto">
	    	</td>
    	</tr>

    	<tr ng-repeat="LINE_ITEM_DETAIL in PARENT_LIST" data-parentid="{literal}{{LINE_ITEM_DETAIL.parentid}}{/literal}" class="parent_row">
    		<td><input type="checkbox" id="emailmarketing_{$INDEX}"></td>
    		<td ng-repeat="SUB_LINE_ITEM_DETAIL in LINE_ITEM_DETAIL.fields" nowrap>
    			{literal}{{SUB_LINE_ITEM_DETAIL}}{/literal}
	    	</td>		    	
    	</tr>	    	
	</tbody>
</table>