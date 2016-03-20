{strip}
<div class="modalController">
	<div class="modal-header contentsBackground">
        <button data-dismiss="modal" class="close" title="{vtranslate('LBL_CLOSE')}">&times;</button>
        <h3>{vtranslate('Duplication Reports',$MODULE_NAME)}</h3>
	</div>
	<div class="modal-body accordion" id="checkDuplicateModal">
		<button class="btn">{vtranslate('Delete only in this list',$MODULE_NAME)}</button>
		<button class="btn btn-danger">{vtranslate('Delete in CRM',$MODULE_NAME)}</button>
	</div>
</div>
{/strip}