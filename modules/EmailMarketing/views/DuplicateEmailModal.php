<?php

// by haidang009

class EmailMarketing_DuplicateEmailModal_View extends Vtiger_Index_View{
	public function process(Vtiger_Request $request){
		$recordId = $request->get('record');
		$moduleName = $request->getModule();
		if(!$this->record){
			$this->record = Vtiger_DetailView_Model::getInstance($moduleName, $recordId);
		}
		$recordModel = $this->record->getRecord();
		$recordModel->construction();

		$orderby = $request->get('orderby');

		$viewer = $this->getViewer($request);
		$viewer->assign('MODULE_NAME', $moduleName);
		$viewer->assign('RECORD', $recordId);

		$viewer->view('DuplicateEmailModal.tpl', $moduleName);
	}
}