<?php

//by haidang009

class EmailMarketing_Paging_View extends Vtiger_Index_View{
	public function process(Vtiger_Request $request){
		$recordId = $request->get('record');
		$moduleName = $request->getModule();
		if(!$this->record){
			$this->record = Vtiger_DetailView_Model::getInstance($moduleName, $recordId);
		}
		$recordModel = $this->record->getRecord();
		$recordModel->construction();
		$limit = $request->get('limit');

		$current_page = ( $request->get('page') ? $request->get('page') : 1);

		$viewer = $this->getViewer($request);
		$viewer->assign('CURRENT_PAGE', $current_page);
		$viewer->assign('TOTAL_PAGES', $recordModel->getTotalPages((int)$limit));
		$viewer->assign('MODULE_NAME', $moduleName);
		$viewer->assign('RECORD', $recordId);

		$viewer->view('Paging.tpl', $moduleName);
	}
}