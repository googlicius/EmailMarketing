<?php

// by haidang009

class EmailMarketing_EmailListAngular_View extends Vtiger_Index_View{
	function process(Vtiger_Request $request){
		$recordId = $request->get('record');
		$moduleName = $request->getModule();
		if(!$this->record){
			$this->record = Vtiger_DetailView_Model::getInstance($moduleName, $recordId);
		}
		$recordModel = $this->record->getRecord();
		$recordModel->construction();
		
		$parentHeader = $recordModel->getParentHeader($json = true);
		$parentList = $recordModel->getParentList($json = true);
		hd_debug($parentList,"EmailMarketing_EmailListAngular_View","a");
		$viewer = $this->getViewer($request);
		$viewer->assign('PARENT_HEADER', $parentHeader);
		$viewer->assign('COLUMNS', count($parentHeader)+2);
		$viewer->assign('PARENT_LIST', $parentList);
		$viewer->assign('PARENT_MODULE_NAME', $recordModel->getParentModuleName());
		$viewer->assign('MODULE_NAME', $moduleName);
		$viewer->assign('RECORD', $recordId);

		$viewer->view('EmailListTableAngular.tpl', $moduleName);
	}
}