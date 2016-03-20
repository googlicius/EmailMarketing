<?php

/* +***********************************************************************************
 * by Haidang009
 * *********************************************************************************** */

class EmailMarketing_Detail_View extends Vtiger_Detail_View {

	/**
	 * Function returns Inventory details
	 * @param Vtiger_Request $request
	 */
	function showModuleDetailView(Vtiger_Request $request) {
		echo parent::showModuleDetailView($request);
		//$this->showEmailListHolder($request);
	}
	/**
	 * Function returns Inventory details
	 * @param Vtiger_Request $request
	 * @return type
	 */
	function showDetailViewByMode(Vtiger_Request $request) {
		return $this->showModuleDetailView($request);
	}

	function showModuleBasicView($request) {
		return $this->showModuleDetailView($request);
	}

	function showEmailListHolder(Vtiger_Request $request){
		$recordId = $request->get('record');
		$moduleName = $request->getModule();

		$viewer = $this->getViewer($request);
		$viewer->view('EmailListHolder.tpl', $moduleName);
		
	}

	/**
	 * Function to get the list of Script models to be included
	 * @param Vtiger_Request $request
	 * @return <Array> - List of Vtiger_JsScript_Model instances
	 */
	function getHeaderScripts(Vtiger_Request $request) {
		$headerScriptInstances = parent::getHeaderScripts($request);
		$jsFileNames = array(
				"modules.Vtiger.resources.Detail",
				"modules.Vtiger.resources.List",
		);
		$jsScriptInstances = $this->checkAndConvertJsScripts($jsFileNames);
		$headerScriptInstances = array_merge($headerScriptInstances, $jsScriptInstances);
		return $headerScriptInstances;
	}
}
