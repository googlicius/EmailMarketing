<div class="pull-left">
	
</div>
<div class="btn btn-success pull-right" id="send_email_btn">{vtranslate('Send Email to this list', $MODULE_NAME)}</div>
<div class="btn btn-danger pull-right hide" id="stop_send" style="margin-right: 10px">{vtranslate('Stop', $MODULE_NAME)}</div>

<div class="timer pull-right" style="margin: 5px 20px 5px 5px"></div>

<div class="clearfix"></div>
<br>
<div id="pagingHolder" class="pull-right">
	{include file="Paging.tpl"|@vtemplate_path:$MODULE_NAME}
</div>

<div class="clearfix"></div>
<div class="contents-topscroll noprint">
	<div class="topscroll-div">
		&nbsp;
	 </div>
</div>

<div id="email_list_holder" class="listViewEntriesDiv contents-bottomscroll" style="text-align:center;">
	<img src="/layouts/vlayout/skins/alphagrey/images/loading.gif" alt="Loading" >
</div>

<!-- LOAD MORE BUTTON -->
<div style="text-align:center">
    <div class="btn btn-primary hide" id="load_more_btn" data-offset data-limit onclick="EmailMarketing_Detail_Js.triggerLoadMore(this)">{vtranslate('Load More',$PARENT_MODULE_NAME)}</div>
</div>