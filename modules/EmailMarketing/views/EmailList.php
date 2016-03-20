<?php

// by haidang009

class EmailMarketing_EmailList_View extends Vtiger_Index_View{
	function process(Vtiger_Request $request){
		$recordId = $request->get('record');
		$moduleName = $request->getModule();
		if(!$this->record){
			$this->record = Vtiger_DetailView_Model::getInstance($moduleName, $recordId);
		}
		$recordModel = $this->record->getRecord();
		$recordModel->construction();
		
		$limit = $request->get('limit');
		$offset = $request->get('offset');
		$limit = (int)$limit;
		
		if($offset != null || $limit != 0)
			$paging = array('offset'=>$offset,'limit'=>$limit);
		else{
			$paging = array('offset'=>0,'limit'=>10);
		}
		
		$parentHeader = $recordModel->getParentHeader();
		$parentList = $recordModel->getParentList($paging);

		$viewer = $this->getViewer($request);
		$viewer->assign('PARENT_HEADER', $parentHeader);
		$viewer->assign('PARENT_LIST', $parentList);
		$viewer->assign('PARENT_MODULE_NAME', $recordModel->getParentModuleName());
		$viewer->assign('MODULE_NAME', $moduleName);
		$viewer->assign('RECORD', $recordId);

		$viewer->view('EmailList.tpl', $moduleName);
	}
}