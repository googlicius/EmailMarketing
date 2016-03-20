<?php

//by haidang009

class EmailMarketing_LoadMore_View extends Vtiger_Index_View{
	public function process(Vtiger_Request $request){
		$recordId = $request->get('record');
		$moduleName = $request->getModule();
		if(!$this->record){
			$this->record = Vtiger_DetailView_Model::getInstance($moduleName, $recordId);
		}
		$recordModel = $this->record->getRecord();
		$recordModel->construction();
		
		$offset = $request->get('offset');
		$limit = $request->get('limit');
		$offset = (int)$offset;
		$limit = (int)$limit;
		if($limit != 0)
			$paging = array('offset'=>$offset,'limit'=>$limit);
		else{
			$paging = array('offset'=>10,'limit'=>10);
		}

		$search_string = $request->get('search_string');
		$orderby = $request->get('orderby');
		
		$header_lengh = count($recordModel->getParentHeader()) + 3;
		$parentList = $recordModel->getParentList($paging, $search_string, $orderby);

		$viewer = $this->getViewer($request);
		$viewer->assign('PARENT_HEADER_LENGH', $header_lengh);
		$viewer->assign('PARENT_LIST', $parentList);
		$viewer->assign('PARENT_MODULE_NAME', $recordModel->getParentModuleName());
		$viewer->assign('MODULE_NAME', $moduleName);
		$viewer->assign('RECORD', $recordId);

		$viewer->view('LoadMore.tpl', $moduleName);
	}
}