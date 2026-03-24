<?php
/* Smarty version 4.5.3, created on 2026-03-24 18:32:57
  from '/home/venom/wwwdir/whmcs/templates/six/clientareaproductdetails.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.5.3',
  'unifunc' => 'content_69c2d8d9175059_95468950',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '71f39610db7dcd3572c5ce574fbbce4265c571a6' => 
    array (
      0 => '/home/venom/wwwdir/whmcs/templates/six/clientareaproductdetails.tpl',
      1 => 1773235103,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_69c2d8d9175059_95468950 (Smarty_Internal_Template $_smarty_tpl) {
if ($_smarty_tpl->tpl_vars['modulecustombuttonresult']->value) {?>
    <?php if ($_smarty_tpl->tpl_vars['modulecustombuttonresult']->value == "success") {?>
        <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"success",'msg'=>$_smarty_tpl->tpl_vars['LANG']->value['moduleactionsuccess'],'textcenter'=>true,'idname'=>"alertModuleCustomButtonSuccess"), 0, true);
?>
    <?php } else { ?>
        <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"error",'msg'=>($_smarty_tpl->tpl_vars['LANG']->value['moduleactionfailed']).(' ').($_smarty_tpl->tpl_vars['modulecustombuttonresult']->value),'textcenter'=>true,'idname'=>"alertModuleCustomButtonFailed"), 0, true);
?>
    <?php }
}?>

<?php if ($_smarty_tpl->tpl_vars['pendingcancellation']->value) {?>
    <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"error",'msg'=>$_smarty_tpl->tpl_vars['LANG']->value['cancellationrequestedexplanation'],'textcenter'=>true,'idname'=>"alertPendingCancellation"), 0, true);
}?>

<?php if ($_smarty_tpl->tpl_vars['unpaidInvoice']->value) {?>
    <div class="alert alert-<?php if ($_smarty_tpl->tpl_vars['unpaidInvoiceOverdue']->value) {?>danger<?php } else { ?>warning<?php }?>" id="alert<?php if ($_smarty_tpl->tpl_vars['unpaidInvoiceOverdue']->value) {?>Overdue<?php } else { ?>Unpaid<?php }?>Invoice">
        <div class="pull-right">
            <a href="viewinvoice.php?id=<?php echo $_smarty_tpl->tpl_vars['unpaidInvoice']->value;?>
" class="btn btn-xs btn-default">
                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'payInvoice'),$_smarty_tpl ) );?>

            </a>
        </div>
        <?php echo $_smarty_tpl->tpl_vars['unpaidInvoiceMessage']->value;?>

    </div>
<?php }?>

<div class="tab-content margin-bottom">
    <div class="tab-pane fade in active" id="tabOverview">

        <?php if ($_smarty_tpl->tpl_vars['tplOverviewTabOutput']->value) {?>
            <?php echo $_smarty_tpl->tpl_vars['tplOverviewTabOutput']->value;?>

        <?php } else { ?>

            <div class="product-details clearfix">

                <div class="row">
                    <div class="col-md-6">

                        <div class="product-status product-status-<?php echo call_user_func_array($_smarty_tpl->registered_plugins[ 'modifier' ][ 'strtolower' ][ 0 ], array( $_smarty_tpl->tpl_vars['rawstatus']->value ));?>
">
                            <div class="product-icon text-center">
                                <span class="fa-stack fa-lg">
                                    <i class="fas fa-circle fa-stack-2x"></i>
                                    <i class="fas fa-<?php if ($_smarty_tpl->tpl_vars['type']->value == "hostingaccount" || $_smarty_tpl->tpl_vars['type']->value == "reselleraccount") {?>hdd<?php } elseif ($_smarty_tpl->tpl_vars['type']->value == "server") {?>database<?php } else { ?>archive<?php }?> fa-stack-1x fa-inverse"></i>
                                </span>
                                <h3><?php echo $_smarty_tpl->tpl_vars['product']->value;?>
</h3>
                                <h4><?php echo $_smarty_tpl->tpl_vars['groupname']->value;?>
</h4>
                            </div>
                            <div class="product-status-text">
                                <?php echo $_smarty_tpl->tpl_vars['status']->value;?>

                            </div>
                        </div>

                        <?php if ($_smarty_tpl->tpl_vars['showRenewServiceButton']->value === true || $_smarty_tpl->tpl_vars['showcancelbutton']->value === true || $_smarty_tpl->tpl_vars['packagesupgrade']->value === true) {?>
                            <div class="row product-actions-wrapper">
                                <?php if ($_smarty_tpl->tpl_vars['packagesupgrade']->value) {?>
                                    <div class="col-xs-12">
                                        <a href="upgrade.php?type=package&amp;id=<?php echo $_smarty_tpl->tpl_vars['id']->value;?>
" class="btn btn-block btn-success">
                                            <i class="fas fa-level-up"></i>
                                            <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'upgrade'),$_smarty_tpl ) );?>

                                        </a>
                                    </div>
                                <?php }?>
                                <?php if ($_smarty_tpl->tpl_vars['showRenewServiceButton']->value === true) {?>
                                    <div class="col-xs-12">
                                        <a href="<?php echo routePath('service-renewals-service',$_smarty_tpl->tpl_vars['id']->value);?>
" class="btn btn-block btn-primary">
                                            <i class="fas fa-sync"></i>
                                            <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'renewService.titleSingular'),$_smarty_tpl ) );?>

                                        </a>
                                    </div>
                                <?php }?>
                                <?php if ($_smarty_tpl->tpl_vars['showcancelbutton']->value) {?>
                                    <div class="col-xs-12">
                                        <a href="clientarea.php?action=cancel&amp;id=<?php echo $_smarty_tpl->tpl_vars['id']->value;?>
" class="btn btn-block btn-danger <?php if ($_smarty_tpl->tpl_vars['pendingcancellation']->value) {?>disabled<?php }?>">
                                            <i class="fas fa-ban"></i>
                                            <?php if ($_smarty_tpl->tpl_vars['pendingcancellation']->value) {?>
                                                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'cancellationrequested'),$_smarty_tpl ) );?>

                                            <?php } else { ?>
                                                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'clientareacancelrequestbutton'),$_smarty_tpl ) );?>

                                            <?php }?>
                                        </a>
                                    </div>
                                <?php }?>
                            </div>
                        <?php }?>

                    </div>
                    <div class="col-md-6 text-center">

                        <h4><?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientareahostingregdate'];?>
</h4>
                        <?php echo $_smarty_tpl->tpl_vars['regdate']->value;?>


                        <?php if ($_smarty_tpl->tpl_vars['firstpaymentamount']->value != $_smarty_tpl->tpl_vars['recurringamount']->value) {?>
                            <h4><?php echo $_smarty_tpl->tpl_vars['LANG']->value['firstpaymentamount'];?>
</h4>
                            <?php echo $_smarty_tpl->tpl_vars['firstpaymentamount']->value;?>

                        <?php }?>

                        <?php if ($_smarty_tpl->tpl_vars['billingcycle']->value != $_smarty_tpl->tpl_vars['LANG']->value['orderpaymenttermonetime'] && $_smarty_tpl->tpl_vars['billingcycle']->value != $_smarty_tpl->tpl_vars['LANG']->value['orderfree']) {?>
                            <h4><?php echo $_smarty_tpl->tpl_vars['LANG']->value['recurringamount'];?>
</h4>
                            <?php echo $_smarty_tpl->tpl_vars['recurringamount']->value;?>

                        <?php }?>

                        <?php if ($_smarty_tpl->tpl_vars['quantitySupported']->value && $_smarty_tpl->tpl_vars['quantity']->value > 1) {?>
                            <h4><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'quantity'),$_smarty_tpl ) );?>
</h4>
                            <?php echo $_smarty_tpl->tpl_vars['quantity']->value;?>

                        <?php }?>

                        <h4><?php echo $_smarty_tpl->tpl_vars['LANG']->value['orderbillingcycle'];?>
</h4>
                        <?php echo $_smarty_tpl->tpl_vars['billingcycle']->value;?>


                        <h4><?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientareahostingnextduedate'];?>
</h4>
                        <?php echo $_smarty_tpl->tpl_vars['nextduedate']->value;?>


                        <h4><?php echo $_smarty_tpl->tpl_vars['LANG']->value['orderpaymentmethod'];?>
</h4>
                        <?php echo $_smarty_tpl->tpl_vars['paymentmethod']->value;?>


                        <?php if ($_smarty_tpl->tpl_vars['suspendreason']->value) {?>
                            <h4><?php echo $_smarty_tpl->tpl_vars['LANG']->value['suspendreason'];?>
</h4>
                            <?php echo $_smarty_tpl->tpl_vars['suspendreason']->value;?>

                        <?php }?>

                    </div>
                </div>

            </div>

            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['hookOutput']->value, 'output');
$_smarty_tpl->tpl_vars['output']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['output']->value) {
$_smarty_tpl->tpl_vars['output']->do_else = false;
?>
                <div>
                    <?php echo $_smarty_tpl->tpl_vars['output']->value;?>

                </div>
            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>

            <?php if ($_smarty_tpl->tpl_vars['domain']->value || $_smarty_tpl->tpl_vars['moduleclientarea']->value || $_smarty_tpl->tpl_vars['configurableoptions']->value || $_smarty_tpl->tpl_vars['customfields']->value || $_smarty_tpl->tpl_vars['lastupdate']->value) {?>
                <div class="row clearfix">
                    <div class="col-xs-12">
                        <ul class="nav nav-tabs nav-tabs-overflow">
                            <?php if ($_smarty_tpl->tpl_vars['domain']->value) {?>
                                <li class="active">
                                    <a href="#domain" data-toggle="tab"><i class="fas fa-globe fa-fw"></i> <?php if ($_smarty_tpl->tpl_vars['type']->value == "server") {
echo $_smarty_tpl->tpl_vars['LANG']->value['sslserverinfo'];
} elseif (($_smarty_tpl->tpl_vars['type']->value == "hostingaccount" || $_smarty_tpl->tpl_vars['type']->value == "reselleraccount") && $_smarty_tpl->tpl_vars['serverdata']->value) {
echo $_smarty_tpl->tpl_vars['LANG']->value['hostingInfo'];
} else {
echo $_smarty_tpl->tpl_vars['LANG']->value['clientareahostingdomain'];
}?></a>
                                </li>
                            <?php } elseif ($_smarty_tpl->tpl_vars['moduleclientarea']->value) {?>
                                <li class="active">
                                    <a href="#manage" data-toggle="tab"><i class="fas fa-globe fa-fw"></i> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['manage'];?>
</a>
                                </li>
                            <?php }?>
                            <?php if ($_smarty_tpl->tpl_vars['configurableoptions']->value) {?>
                                <li<?php if (!$_smarty_tpl->tpl_vars['domain']->value && !$_smarty_tpl->tpl_vars['moduleclientarea']->value) {?> class="active"<?php }?>>
                                    <a href="#configoptions" data-toggle="tab"><i class="fas fa-cubes fa-fw"></i> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['orderconfigpackage'];?>
</a>
                                </li>
                            <?php }?>
                            <?php if ($_smarty_tpl->tpl_vars['metricStats']->value) {?>
                                <li<?php if (!$_smarty_tpl->tpl_vars['domain']->value && !$_smarty_tpl->tpl_vars['moduleclientarea']->value && !$_smarty_tpl->tpl_vars['configurableoptions']->value) {?> class="active"<?php }?>>
                                    <a href="#metrics" data-toggle="tab"><i class="fas fa-chart-line fa-fw"></i> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['metrics']['title'];?>
</a>
                                </li>
                            <?php }?>
                            <?php if ($_smarty_tpl->tpl_vars['customfields']->value) {?>
                                <li<?php if (!$_smarty_tpl->tpl_vars['domain']->value && !$_smarty_tpl->tpl_vars['moduleclientarea']->value && !$_smarty_tpl->tpl_vars['metricStats']->value && !$_smarty_tpl->tpl_vars['configurableoptions']->value) {?> class="active"<?php }?>>
                                    <a href="#additionalinfo" data-toggle="tab"><i class="fas fa-info fa-fw"></i> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['additionalInfo'];?>
</a>
                                </li>
                            <?php }?>
                            <?php if ($_smarty_tpl->tpl_vars['lastupdate']->value) {?>
                                <li<?php if (!$_smarty_tpl->tpl_vars['domain']->value && !$_smarty_tpl->tpl_vars['moduleclientarea']->value && !$_smarty_tpl->tpl_vars['configurableoptions']->value && !$_smarty_tpl->tpl_vars['customfields']->value) {?> class="active"<?php }?>>
                                    <a href="#resourceusage" data-toggle="tab"><i class="fas fa-inbox fa-fw"></i> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['resourceUsage'];?>
</a>
                                </li>
                            <?php }?>
                        </ul>
                    </div>
                </div>

                <div class="tab-content product-details-tab-container">
                    <?php if ($_smarty_tpl->tpl_vars['domain']->value) {?>
                        <div class="tab-pane fade in active text-center" id="domain">
                            <?php if ($_smarty_tpl->tpl_vars['type']->value == "server") {?>
                                <div class="row">
                                    <div class="col-sm-5 text-right">
                                        <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['serverhostname'];?>
</strong>
                                    </div>
                                    <div class="col-sm-7 text-left">
                                        <?php echo $_smarty_tpl->tpl_vars['domain']->value;?>

                                    </div>
                                </div>
                                <?php if ($_smarty_tpl->tpl_vars['dedicatedip']->value) {?>
                                    <div class="row">
                                        <div class="col-sm-5 text-right">
                                            <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['primaryIP'];?>
</strong>
                                        </div>
                                        <div class="col-sm-7 text-left">
                                            <?php echo $_smarty_tpl->tpl_vars['dedicatedip']->value;?>

                                        </div>
                                    </div>
                                <?php }?>
                                <?php if ($_smarty_tpl->tpl_vars['assignedips']->value) {?>
                                    <div class="row">
                                        <div class="col-sm-5 text-right">
                                            <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['assignedIPs'];?>
</strong>
                                        </div>
                                        <div class="col-sm-7 text-left">
                                            <?php echo nl2br((string) $_smarty_tpl->tpl_vars['assignedips']->value, (bool) 1);?>

                                        </div>
                                    </div>
                                <?php }?>
                                <?php if ($_smarty_tpl->tpl_vars['ns1']->value || $_smarty_tpl->tpl_vars['ns2']->value) {?>
                                    <div class="row">
                                        <div class="col-sm-5 text-right">
                                            <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['domainnameservers'];?>
</strong>
                                        </div>
                                        <div class="col-sm-7 text-left">
                                            <?php echo $_smarty_tpl->tpl_vars['ns1']->value;?>
<br /><?php echo $_smarty_tpl->tpl_vars['ns2']->value;?>

                                        </div>
                                    </div>
                                <?php }?>
                            <?php } else { ?>
                                <?php if ($_smarty_tpl->tpl_vars['domain']->value) {?>
                                    <div class="row">
                                        <div class="col-sm-5 text-right">
                                            <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['orderdomain'];?>
</strong>
                                        </div>
                                        <div class="col-sm-7 text-left">
                                            <?php echo $_smarty_tpl->tpl_vars['domain']->value;?>

                                        </div>
                                    </div>
                                <?php }?>
                                <?php if ($_smarty_tpl->tpl_vars['username']->value) {?>
                                    <div class="row">
                                        <div class="col-sm-5 text-right">
                                            <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['serverusername'];?>
</strong>
                                        </div>
                                        <div class="col-sm-7 text-left">
                                            <?php echo $_smarty_tpl->tpl_vars['username']->value;?>

                                        </div>
                                    </div>
                                <?php }?>
                                <?php if ($_smarty_tpl->tpl_vars['serverdata']->value) {?>
                                    <div class="row">
                                        <div class="col-sm-5 text-right">
                                            <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['servername'];?>
</strong>
                                        </div>
                                        <div class="col-sm-7 text-left">
                                            <?php echo $_smarty_tpl->tpl_vars['serverdata']->value['hostname'];?>

                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-5 text-right">
                                            <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['domainregisternsip'];?>
</strong>
                                        </div>
                                        <div class="col-sm-7 text-left">
                                            <?php echo $_smarty_tpl->tpl_vars['serverdata']->value['ipaddress'];?>

                                        </div>
                                    </div>
                                    <?php if ($_smarty_tpl->tpl_vars['serverdata']->value['nameserver1'] || $_smarty_tpl->tpl_vars['serverdata']->value['nameserver2'] || $_smarty_tpl->tpl_vars['serverdata']->value['nameserver3'] || $_smarty_tpl->tpl_vars['serverdata']->value['nameserver4'] || $_smarty_tpl->tpl_vars['serverdata']->value['nameserver5']) {?>
                                        <div class="row">
                                            <div class="col-sm-5 text-right">
                                                <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['domainnameservers'];?>
</strong>
                                            </div>
                                            <div class="col-sm-7 text-left">
                                                <?php if ($_smarty_tpl->tpl_vars['serverdata']->value['nameserver1']) {
echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver1'];?>
 (<?php echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver1ip'];?>
)<br /><?php }?>
                                                <?php if ($_smarty_tpl->tpl_vars['serverdata']->value['nameserver2']) {
echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver2'];?>
 (<?php echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver2ip'];?>
)<br /><?php }?>
                                                <?php if ($_smarty_tpl->tpl_vars['serverdata']->value['nameserver3']) {
echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver3'];?>
 (<?php echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver3ip'];?>
)<br /><?php }?>
                                                <?php if ($_smarty_tpl->tpl_vars['serverdata']->value['nameserver4']) {
echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver4'];?>
 (<?php echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver4ip'];?>
)<br /><?php }?>
                                                <?php if ($_smarty_tpl->tpl_vars['serverdata']->value['nameserver5']) {
echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver5'];?>
 (<?php echo $_smarty_tpl->tpl_vars['serverdata']->value['nameserver5ip'];?>
)<br /><?php }?>
                                            </div>
                                        </div>
                                    <?php }?>
                                <?php }?>
                                <?php if ($_smarty_tpl->tpl_vars['domain']->value && $_smarty_tpl->tpl_vars['sslStatus']->value) {?>
                                    <div class="row">
                                        <div class="col-sm-5 text-right">
                                            <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['sslState']['sslStatus'];?>
</strong>
                                        </div>
                                        <div class="col-sm-7 text-left<?php if ($_smarty_tpl->tpl_vars['sslStatus']->value->isInactive()) {?> ssl-inactive<?php }?>">
                                            <img src="<?php echo $_smarty_tpl->tpl_vars['sslStatus']->value->getImagePath();?>
" width="12" data-type="service" data-domain="<?php echo $_smarty_tpl->tpl_vars['domain']->value;?>
" data-showlabel="1" class="<?php echo $_smarty_tpl->tpl_vars['sslStatus']->value->getClass();?>
"/>
                                            <span id="statusDisplayLabel">
                                                <?php if (!$_smarty_tpl->tpl_vars['sslStatus']->value->needsResync()) {?>
                                                    <?php echo $_smarty_tpl->tpl_vars['sslStatus']->value->getStatusDisplayLabel();?>

                                                <?php } else { ?>
                                                    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['loading'];?>

                                                <?php }?>
                                            </span>
                                        </div>
                                    </div>
                                    <?php if ($_smarty_tpl->tpl_vars['sslStatus']->value->isActive() || $_smarty_tpl->tpl_vars['sslStatus']->value->needsResync()) {?>
                                        <div class="row">
                                            <div class="col-sm-5 text-right">
                                                <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['sslState']['startDate'];?>
</strong>
                                            </div>
                                            <div class="col-sm-7 text-left" id="ssl-startdate">
                                                <?php if (!$_smarty_tpl->tpl_vars['sslStatus']->value->needsResync() || $_smarty_tpl->tpl_vars['sslStatus']->value->startDate) {?>
                                                    <?php echo $_smarty_tpl->tpl_vars['sslStatus']->value->startDate->toClientDateFormat();?>

                                                <?php } else { ?>
                                                    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['loading'];?>

                                                <?php }?>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-5 text-right">
                                                <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['sslState']['expiryDate'];?>
</strong>
                                            </div>
                                            <div class="col-sm-7 text-left" id="ssl-expirydate">
                                                <?php if (!$_smarty_tpl->tpl_vars['sslStatus']->value->needsResync() || $_smarty_tpl->tpl_vars['sslStatus']->value->expiryDate) {?>
                                                    <?php echo $_smarty_tpl->tpl_vars['sslStatus']->value->expiryDate->toClientDateFormat();?>

                                                <?php } else { ?>
                                                    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['loading'];?>

                                                <?php }?>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-5 text-right">
                                                <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['sslState']['issuerName'];?>
</strong>
                                            </div>
                                            <div class="col-sm-7 text-left" id="ssl-issuer">
                                                <?php if (!$_smarty_tpl->tpl_vars['sslStatus']->value->needsResync() || $_smarty_tpl->tpl_vars['sslStatus']->value->issuerName) {?>
                                                    <?php echo $_smarty_tpl->tpl_vars['sslStatus']->value->issuerName;?>

                                                <?php } else { ?>
                                                    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['loading'];?>

                                                <?php }?>
                                            </div>
                                        </div>
                                    <?php }?>
                                <?php }?>
                                <br>
                                <p>
                                    <a href="http://<?php echo $_smarty_tpl->tpl_vars['domain']->value;?>
" class="btn btn-default" target="_blank"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['visitwebsite'];?>
</a>
                                    <?php if ($_smarty_tpl->tpl_vars['domainId']->value) {?>
                                        <a href="clientarea.php?action=domaindetails&id=<?php echo $_smarty_tpl->tpl_vars['domainId']->value;?>
" class="btn btn-default" target="_blank"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['managedomain'];?>
</a>
                                    <?php }?>
                                </p>
                            <?php }?>
                            <?php if ($_smarty_tpl->tpl_vars['moduleclientarea']->value) {?>
                                <div class="text-center module-client-area">
                                    <?php echo $_smarty_tpl->tpl_vars['moduleclientarea']->value;?>

                                </div>
                            <?php }?>
                        </div>
                        <?php if ($_smarty_tpl->tpl_vars['sslStatus']->value) {?>
                            <div class="tab-pane fade text-center" id="ssl-info">
                                <?php if ($_smarty_tpl->tpl_vars['sslStatus']->value->isActive()) {?>
                                    <div class="alert alert-success" role="alert">
                                        <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'sslActive','expiry'=>$_smarty_tpl->tpl_vars['sslStatus']->value->expiryDate->toClientDateFormat()),$_smarty_tpl ) );?>

                                    </div>
                                <?php } else { ?>
                                    <div class="alert alert-warning ssl-required" role="alert">
                                        <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'sslState.sslInactive'),$_smarty_tpl ) );?>

                                    </div>
                                <?php }?>
                            </div>
                        <?php }?>
                    <?php } elseif ($_smarty_tpl->tpl_vars['moduleclientarea']->value) {?>
                        <div class="tab-pane fade<?php if (!$_smarty_tpl->tpl_vars['domain']->value) {?> in active<?php }?> text-center" id="manage">
                            <?php if ($_smarty_tpl->tpl_vars['moduleclientarea']->value) {?>
                                <div class="text-center module-client-area">
                                    <?php echo $_smarty_tpl->tpl_vars['moduleclientarea']->value;?>

                                </div>
                            <?php }?>
                        </div>
                    <?php }?>
                    <?php if ($_smarty_tpl->tpl_vars['configurableoptions']->value) {?>
                        <div class="tab-pane fade<?php if (!$_smarty_tpl->tpl_vars['domain']->value && !$_smarty_tpl->tpl_vars['moduleclientarea']->value) {?> in active<?php }?> text-center" id="configoptions">
                            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['configurableoptions']->value, 'configoption');
$_smarty_tpl->tpl_vars['configoption']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['configoption']->value) {
$_smarty_tpl->tpl_vars['configoption']->do_else = false;
?>
                                <div class="row">
                                    <div class="col-sm-5">
                                        <strong><?php echo $_smarty_tpl->tpl_vars['configoption']->value['optionname'];?>
</strong>
                                    </div>
                                    <div class="col-sm-7 text-left">
                                        <?php if ($_smarty_tpl->tpl_vars['configoption']->value['optiontype'] == 3) {
if ($_smarty_tpl->tpl_vars['configoption']->value['selectedqty']) {
echo $_smarty_tpl->tpl_vars['LANG']->value['yes'];
} else {
echo $_smarty_tpl->tpl_vars['LANG']->value['no'];
}
} elseif ($_smarty_tpl->tpl_vars['configoption']->value['optiontype'] == 4) {
echo $_smarty_tpl->tpl_vars['configoption']->value['selectedqty'];?>
 x <?php echo $_smarty_tpl->tpl_vars['configoption']->value['selectedoption'];
} else {
echo $_smarty_tpl->tpl_vars['configoption']->value['selectedoption'];
}?>
                                    </div>
                                </div>
                            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                        </div>
                    <?php }?>
                    <?php if ($_smarty_tpl->tpl_vars['metricStats']->value) {?>
                        <div class="tab-pane fade<?php if (!$_smarty_tpl->tpl_vars['domain']->value && !$_smarty_tpl->tpl_vars['moduleclientarea']->value && !$_smarty_tpl->tpl_vars['configurableoptions']->value) {?> in active<?php }?>" id="metrics">
                            <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/clientareaproductusagebilling.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?>
                        </div>
                    <?php }?>
                    <?php if ($_smarty_tpl->tpl_vars['customfields']->value) {?>
                        <div class="tab-pane fade<?php if (!$_smarty_tpl->tpl_vars['domain']->value && !$_smarty_tpl->tpl_vars['moduleclientarea']->value && !$_smarty_tpl->tpl_vars['configurableoptions']->value && !$_smarty_tpl->tpl_vars['metricStats']->value) {?> in active<?php }?> text-center" id="additionalinfo">
                            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['customfields']->value, 'field');
$_smarty_tpl->tpl_vars['field']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['field']->value) {
$_smarty_tpl->tpl_vars['field']->do_else = false;
?>
                                <div class="row">
                                    <div class="col-sm-5">
                                        <strong><?php echo $_smarty_tpl->tpl_vars['field']->value['name'];?>
</strong>
                                    </div>
                                    <div class="col-sm-7 text-left">
                                        <?php echo $_smarty_tpl->tpl_vars['field']->value['value'];?>

                                    </div>
                                </div>
                            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                        </div>
                    <?php }?>
                    <?php if ($_smarty_tpl->tpl_vars['lastupdate']->value) {?>
                        <div class="tab-pane fade text-center" id="resourceusage">
                            <div class="col-sm-10 col-sm-offset-1">
                                <div class="col-sm-6">
                                    <h4><?php echo $_smarty_tpl->tpl_vars['LANG']->value['diskSpace'];?>
</h4>
                                    <input type="text" value="<?php echo substr((string) $_smarty_tpl->tpl_vars['diskpercent']->value, (int) 0, (int) -1);?>
" class="dial-usage" data-width="100" data-height="100" data-min="0" data-readOnly="true" />
                                    <p><?php echo $_smarty_tpl->tpl_vars['diskusage']->value;?>
MB / <?php echo $_smarty_tpl->tpl_vars['disklimit']->value;?>
MB</p>
                                </div>
                                <div class="col-sm-6">
                                    <h4><?php echo $_smarty_tpl->tpl_vars['LANG']->value['bandwidth'];?>
</h4>
                                    <input type="text" value="<?php echo substr((string) $_smarty_tpl->tpl_vars['bwpercent']->value, (int) 0, (int) -1);?>
" class="dial-usage" data-width="100" data-height="100" data-min="0" data-readOnly="true" />
                                    <p><?php echo $_smarty_tpl->tpl_vars['bwusage']->value;?>
MB / <?php echo $_smarty_tpl->tpl_vars['bwlimit']->value;?>
MB</p>
                                </div>
                            </div>
                            <div class="clearfix">
                            </div>
                            <p class="text-muted"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientarealastupdated'];?>
: <?php echo $_smarty_tpl->tpl_vars['lastupdate']->value;?>
</p>

                            <?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH_JS']->value;?>
/jquery.knob.js"><?php echo '</script'; ?>
>
                            <?php echo '<script'; ?>
 type="text/javascript">
                            jQuery(function() {
                                jQuery(".dial-usage").knob({'format':function (v) { alert(v); }});
                            });
                            <?php echo '</script'; ?>
>
                        </div>
                    <?php }?>
                </div>
            <?php }?>
            <?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH_JS']->value;?>
/bootstrap-tabdrop.js"><?php echo '</script'; ?>
>
            <?php echo '<script'; ?>
 type="text/javascript">
                jQuery('.nav-tabs-overflow').tabdrop();
            <?php echo '</script'; ?>
>

        <?php }?>

    </div>
    <div class="tab-pane fade in" id="tabDownloads">

        <h3><?php echo $_smarty_tpl->tpl_vars['LANG']->value['downloadstitle'];?>
</h3>

        <?php ob_start();
echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>"clientAreaProductDownloadsAvailable"),$_smarty_tpl ) );
$_prefixVariable1=ob_get_clean();
$_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"info",'msg'=>$_prefixVariable1,'textcenter'=>true), 0, true);
?>

        <div class="row">
            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['downloads']->value, 'download');
$_smarty_tpl->tpl_vars['download']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['download']->value) {
$_smarty_tpl->tpl_vars['download']->do_else = false;
?>
                <div class="col-xs-10 col-xs-offset-1">
                    <h4><?php echo $_smarty_tpl->tpl_vars['download']->value['title'];?>
</h4>
                    <p>
                        <?php echo $_smarty_tpl->tpl_vars['download']->value['description'];?>

                    </p>
                    <p>
                        <a href="<?php echo $_smarty_tpl->tpl_vars['download']->value['link'];?>
" class="btn btn-default"><i class="fas fa-download"></i> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['downloadname'];?>
</a>
                    </p>
                </div>
            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
        </div>

    </div>
    <div class="tab-pane fade in" id="tabAddons">

        <h3><?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientareahostingaddons'];?>
</h3>

        <?php if ($_smarty_tpl->tpl_vars['addonsavailable']->value) {?>
            <?php ob_start();
echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>"clientAreaProductAddonsAvailable"),$_smarty_tpl ) );
$_prefixVariable2=ob_get_clean();
$_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"info",'msg'=>$_prefixVariable2,'textcenter'=>true), 0, true);
?>
        <?php }?>

        <div class="row">
            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['addons']->value, 'addon');
$_smarty_tpl->tpl_vars['addon']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['addon']->value) {
$_smarty_tpl->tpl_vars['addon']->do_else = false;
?>
                <div class="col-xs-10 col-xs-offset-1">
                    <div class="panel panel-default panel-accent-blue">
                        <div class="panel-heading">
                            <?php echo $_smarty_tpl->tpl_vars['addon']->value['name'];?>

                            <div class="pull-right status-<?php echo call_user_func_array($_smarty_tpl->registered_plugins[ 'modifier' ][ 'strtolower' ][ 0 ], array( $_smarty_tpl->tpl_vars['addon']->value['rawstatus'] ));?>
"><?php echo $_smarty_tpl->tpl_vars['addon']->value['status'];?>
</div>
                        </div>
                        <div class="row panel-body">
                            <div class="col-md-6">
                                <p>
                                    <?php echo $_smarty_tpl->tpl_vars['addon']->value['pricing'];?>

                                </p>
                                <p>
                                    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['registered'];?>
: <?php echo $_smarty_tpl->tpl_vars['addon']->value['regdate'];?>

                                </p>
                                <p>
                                    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientareahostingnextduedate'];?>
: <?php echo $_smarty_tpl->tpl_vars['addon']->value['nextduedate'];?>

                                </p>
                            </div>
                        </div>
                        <div class="panel-footer">
                            <?php echo $_smarty_tpl->tpl_vars['addon']->value['managementActions'];?>

                        </div>
                    </div>
                </div>
            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
        </div>

    </div>
    <div class="tab-pane fade in" id="tabChangepw">

        <h3><?php echo $_smarty_tpl->tpl_vars['LANG']->value['serverchangepassword'];?>
</h3>

        <?php if ($_smarty_tpl->tpl_vars['modulechangepwresult']->value) {?>
            <?php if ($_smarty_tpl->tpl_vars['modulechangepwresult']->value == "success") {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"success",'msg'=>$_smarty_tpl->tpl_vars['modulechangepasswordmessage']->value,'textcenter'=>true), 0, true);
?>
            <?php } elseif ($_smarty_tpl->tpl_vars['modulechangepwresult']->value == "error") {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"error",'msg'=>preg_replace('!<[^>]*?>!', ' ', (string) $_smarty_tpl->tpl_vars['modulechangepasswordmessage']->value),'textcenter'=>true), 0, true);
?>
            <?php }?>
        <?php }?>

        <form class="form-horizontal using-password-strength" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>
?action=productdetails#tabChangepw" role="form">
            <input type="hidden" name="id" value="<?php echo $_smarty_tpl->tpl_vars['id']->value;?>
" />
            <input type="hidden" name="modulechangepassword" value="true" />

            <div id="newPassword1" class="form-group has-feedback">
                <label for="inputNewPassword1" class="col-sm-4 control-label"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['newpassword'];?>
</label>
                <div class="col-sm-5">
                    <input type="password" class="form-control" id="inputNewPassword1" name="newpw" autocomplete="off" />
                    <span class="form-control-feedback glyphicon"></span>
                    <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/pwstrength.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?>
                </div>
                <div class="col-sm-3">
                    <button type="button" class="btn btn-default generate-password" data-targetfields="inputNewPassword1,inputNewPassword2">
                        <?php echo $_smarty_tpl->tpl_vars['LANG']->value['generatePassword']['btnLabel'];?>

                    </button>
                </div>
            </div>
            <div id="newPassword2" class="form-group has-feedback">
                <label for="inputNewPassword2" class="col-sm-4 control-label"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['confirmnewpassword'];?>
</label>
                <div class="col-sm-5">
                    <input type="password" class="form-control" id="inputNewPassword2" name="confirmpw" autocomplete="off" />
                    <span class="form-control-feedback glyphicon"></span>
                    <div id="inputNewPassword2Msg">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-6 col-sm-6">
                    <input class="btn btn-primary" type="submit" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientareasavechanges'];?>
" />
                    <input class="btn" type="reset" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['cancel'];?>
" />
                </div>
            </div>

        </form>

    </div>
</div>
<?php }
}
