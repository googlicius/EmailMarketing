<?php

/**
 * by haidang009
 */
 
 class EmailMarketing_Record_Model extends Vtiger_Record_Model{

 	protected $parentSummaryFields;
 	protected $parentModuleName;

 	function setParentModuleName(){
 		$source = $this->get('emailmarketing_source');

 		if($source == 'SRC_LEAD') $parentModuleName = 'Leads';
		elseif($source == 'SRC_CONTACT') $parentModuleName = 'Contacts';
		else $parentModuleName = 'Accounts';
		$this->parentModuleName = $parentModuleName;
 	}

 	function setParentSummaryFields(){
 		$parentModuleInstance = Vtiger_Module_Model::getInstance($this->getParentModuleName());
		$this->parentSummaryFields = $parentModuleInstance->getSummaryViewFieldsList();
 	}

 	function construction(){
 		$this->setParentModuleName();
 		$this->setParentSummaryFields();
 	}

 	function getTotalPages($records_per_page){
 		$recordid = $this->getId();
 		global $adb;
 		$sql = "SELECT * FROM vtiger_emailmarketing_list vel LEFT JOIN vtiger_email_track vec ON vel.emailid = vec.mailid WHERE vel.emailmarketingid = ?";
 		$result = $adb->pquery($sql,array($recordid));
 		$total_records = $adb->num_rows($result);

 		$chia_lay_du = $total_records%$records_per_page;
			
		if($chia_lay_du != 0){
			$total_pages = (int)($total_records/$records_per_page) + 1;
		}else{
			$total_pages = (int)($total_records/$records_per_page);
		}
		if($total_pages<1){
			$total_pages = 1;
		}
		return $total_pages;
 	}

 	function sqlBuilder($search_string = null, $orderby = null,$has_limit = true){
 		$sql = "SELECT * FROM vtiger_emailmarketing_list vel";
 		switch ($this->parentModuleName) {
 			case 'Leads':
 				$tablealias = 'vl';
 				$sql .= " INNER JOIN vtiger_leaddetails $tablealias ON $tablealias.leadid = vel.parentid";
 				$sql .= " INNER JOIN vtiger_leadaddress vla ON $tablealias.leadid = vla.leadaddressid";
 				$sql .= " INNER JOIN vtiger_leadsubdetails vlsd ON $tablealias.leadid = vlsd.leadsubscriptionid";
 				break;
 			case 'Contacts':
 				$tablealias = 'vc';
 				$sql .= " INNER JOIN vtiger_contacts $tablealias ON $tablealias.contactid = vel.parentid";
 				break;
 			case 'Accounts':
 				$tablealias = 'va';
 				$sql .= " INNER JOIN vtiger_accounts $tablealias ON $tablealias.accountid = vel.parentid";
 				break;
 			
 			default:
 				# code...
 				break;
 		}
 		$sql .= " INNER JOIN vtiger_crmentity vce ON vel.parentid = vce.crmid
 				LEFT JOIN vtiger_email_track vec ON vel.emailid = vec.mailid WHERE ";

 		if($search_string){
	 		foreach ($search_string as $key => $value) {
	 			if($value['value'] != '' || $value['value'] != null)
	 				$sql .= " ".$value['name']." LIKE '%".$value['value']."%' AND";
	 		}
 		}

 			
 		$sql .=" vel.emailmarketingid = ? AND vce.deleted = 0";

 		if($orderby){
 			$sql .= " ORDER BY ".$orderby['name']." ".$orderby['value'];
 		}

 		if($has_limit)
 			$sql .= " LIMIT ?,?";

	 	return $sql;
 	}

 	function getParentList($paging = array(),$search_string = null, $orderby = null, $json = false){
 		$recordid = $this->getId();

 		// $paging phai dasy du offset va limit
 		$required = array('offset','limit');
 		if(empty($paging) && count(array_intersect_key(array_flip($required), $paging)) !== count($required)){
 			$paging['offset'] = 0;
 			$paging['limit'] = 10;
 		}

 		global $adb;

 		$sql_params = array($recordid,(int)$paging['offset'],(int)$paging['limit']);
 		if($search_string && $orderby)
 			$sql = $this->sqlBuilder($search_string, $orderby);
 		elseif($search_string)
 			$sql = $this->sqlBuilder($search_string);
 		elseif($orderby)
 			$sql = $this->sqlBuilder(null, $orderby);
 		else
 			$sql = "SELECT * FROM vtiger_emailmarketing_list vel 
	 			LEFT JOIN vtiger_email_track vec ON vel.emailid = vec.mailid
	 			INNER JOIN vtiger_crmentity vce ON vel.parentid = vce.crmid
	 			WHERE vel.emailmarketingid = ? AND vce.deleted = 0
	 			ORDER BY vec.access_count DESC LIMIT ?,?";

 		$result = $adb->pquery($sql,array($recordid,(int)$paging['offset'],(int)$paging['limit']));
 		$result_num_rows = $adb->num_rows($result);
 		
 		$parent_list = array();
 		for ($i=0;$i<$result_num_rows;$i++) {
 			$parentid = $adb->query_result($result,$i,'parentid');
 			$parentModelInstance = Vtiger_Record_Model::getInstanceById($parentid);

 			$parent_list[$i]['fields']['status'] = $adb->query_result($result,$i,'emailmarketing_status');
 			$parent_list[$i]['fields']['access_count'] = $adb->query_result($result,$i,'access_count');
 			foreach ($this->parentSummaryFields as $key => $value) {
				$parent_list[$i]['parentid'] = $parentid;
				$parent_list[$i]['fields'][$key] = $parentModelInstance->getDisplayValue($key);
			}
 		}

 		// check duplicate email in list
 		$parent_list = ( $json == false ? $parent_list : Zend_Json::encode($parent_list) );
 		return $parent_list;
 	}

 	function getParentHeader($json = false){
		$header = array();
		foreach ($this->parentSummaryFields as $key => $value) {
			$header[] = array(
				'label' =>$value->get('label'),
				'name' =>$value->get('name')
			);
		}

		$parent_list = ( $json == false ? $parent_list : Zend_Json::encode($parent_list) );
		return $header;
 	}

 	function getParentModuleName(){
		return $this->parentModuleName;
 	}
 }