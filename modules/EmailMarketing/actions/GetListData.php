<?php

// by haidang009

class EmailMarketing_GetListData_Action extends Vtiger_Action_Controller{
	public function checkPermission(Vtiger_Request $request) {
		$moduleName = $request->getModule();
		$recordId = $request->get('record');
		if(!Users_Privileges_Model::isPermitted($moduleName, 'DetailView', $recordId)) {
			throw new AppException(vtranslate('LBL_PERMISSION_DENIED', $moduleName));
		}
	}

	function process(Vtiger_Request $request){
		$targetFunction = $request->get('mode');
		$this->$targetFunction($request);
	}

	function get_total_email($request){
		global $adb;
		$source = $request->get('source');
		$campaign_id = $request->get('campaign_id');
		if($source == 'SRC_LEAD') $res_num_rows = $this->getLeadNumFromCampaign($campaign_id);
		elseif($source == 'SRC_CONTACT') $res_num_rows = $this->getContactNumFromCampaign($campaign_id);
		else $res_num_rows = $this->getAccountNumFromCampaign($campaign_id);
		echo $res_num_rows;
	}

	function getLeadNumFromCampaign($campaign_id){
		global $adb;
		$result = $adb->pquery("SELECT * FROM `vtiger_campaignleadrel` WHERE campaignid=?",array($campaign_id));
		$result_num_rows = $adb->num_rows($result);
		return $result_num_rows;
	}

	function getContactNumFromCampaign($campaign_id){
		global $adb;
		$result = $adb->pquery("SELECT * FROM `vtiger_campaigncontrel` WHERE campaignid=?",array($campaign_id));
		$result_num_rows = $adb->num_rows($result);
		return $result_num_rows;
	}

	function getAccountNumFromCampaign($campaign_id){
		global $adb;
		$result = $adb->pquery("SELECT * FROM `vtiger_campaignaccountrel` WHERE campaignid=?",array($campaign_id));
		$result_num_rows = $adb->num_rows($result);
		return $result_num_rows;
	}
}