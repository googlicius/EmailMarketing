<?php
/*+***********************************************************************************
 * By haidang009
 *************************************************************************************/

Class EmailMarketing_Edit_View extends Vtiger_Edit_View {

	function preProcess(Vtiger_Request $request){
		$viewer = $this->getViewer($request);
		
		$emailTemplateModuleModel = Settings_Vtiger_Module_Model::getInstance('Settings:EmailTemplates');
                
		$emailTemplateListURL = $emailTemplateModuleModel->getListViewUrl();
		
		$viewer->assign('EMAIL_TEMPLATE_URL', $emailTemplateListURL);

		parent::preProcess($request);
	}

	/**
	 * Function to get the list of Script models to be included
	 * @param Vtiger_Request $request
	 * @return <Array> - List of Vtiger_JsScript_Model instances
	 */
	function getHeaderScripts(Vtiger_Request $request) {
		$headerScriptInstances = parent::getHeaderScripts($request);

		$jsFileNames = array(
			'libraries.jquery.ckeditor.ckeditor',
		);
		
		$jsScriptInstances = $this->checkAndConvertJsScripts($jsFileNames);
		$headerScriptInstances = array_merge($headerScriptInstances, $jsScriptInstances);

		return $headerScriptInstances;
	}
}