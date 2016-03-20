<?php

// by haidang009

require_once 'modules/Emails/mail.php';

class EmailMarketing_SendEmail_Action extends Vtiger_Action_Controller{
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

	// when send email done, execute function callback to update current parent
	function update_current_parent($request){
		global $HELPDESK_SUPPORT_NAME,$HELPDESK_SUPPORT_EMAIL_ID, $adb, $site_URL;
		$parentid = $request->get('parentid');
		$email = $request->get('email');
		$email_status = $request->get('email_status');
		// $result = send_mail('EmailMarketing',$email,$HELPDESK_SUPPORT_NAME,$HELPDESK_SUPPORT_EMAIL_ID,$request->get('subject'),$request->get('content'));

		if ($email_status != -1){
			$params = array('Sent','',$parentid);
		}else{
			$params = array('Error',$result,$parentid);
		}
		$sql = "UPDATE `vtiger_emailmarketing_list` SET `status` = ?, `detail` = ? WHERE `parentid` = ?";

		$adb->pquery($sql,$params);

		echo Zend_Json::encode(array(
				'email_status' => $email_status,
				'parentid' => $parentid,
				'email' => $email,
			));
	}

	function getListEmailNotSent($request){
		global $adb;
		$result = $adb->pquery("SELECT * FROM vtiger_emailmarketing_list WHERE emailmarketingid=? AND status IS NULL",array($request->get('record')));
		$result_num_rows = $adb->num_rows($result);

		if($result_num_rows>0){
			$parentid = $adb->query_result($result,0,'parentid');
			$parentModelInstance = Vtiger_Record_Model::getInstanceById($parentid);
			$parentModuleName = $parentModelInstance->getModuleName();
		}

		if($parentModuleName == 'Accounts') $emailField = 'email1';
		else $emailField = 'email';

		$thisModelInstance = Vtiger_Record_Model::getInstanceById($request->get('record'));
		$campaign_id = $thisModelInstance->get('campaign_id');
		
		for($i=0;$i<$result_num_rows;$i++){
			$parentid = $adb->query_result($result,$i,'parentid');
 			$parentModelInstance = Vtiger_Record_Model::getInstanceById($parentid);

 			if($parentModelInstance->get($emailField) != null){
	 			$parent_list[$i]['email'] = $parentModelInstance->get($emailField);
	 			$parent_list[$i]['label'] = $parentModelInstance->getName();
	 			$parent_list[$i]['parentid'] = $parentid;
	 			$parent_list[$i]['campaign_id'] = $campaign_id;
 			}
		}
		echo Zend_Json::encode($parent_list);
	}
}