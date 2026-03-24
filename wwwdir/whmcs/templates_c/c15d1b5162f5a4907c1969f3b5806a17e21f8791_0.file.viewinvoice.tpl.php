<?php
/* Smarty version 4.5.3, created on 2026-03-24 18:33:00
  from '/home/venom/wwwdir/whmcs/templates/six/viewinvoice.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.5.3',
  'unifunc' => 'content_69c2d8dc445271_65992956',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'c15d1b5162f5a4907c1969f3b5806a17e21f8791' => 
    array (
      0 => '/home/venom/wwwdir/whmcs/templates/six/viewinvoice.tpl',
      1 => 1773235103,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_69c2d8dc445271_65992956 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_checkPlugins(array(0=>array('file'=>'/home/venom/wwwdir/whmcs/vendor/smarty/smarty/libs/plugins/modifier.truncate.php','function'=>'smarty_modifier_truncate',),));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="<?php echo $_smarty_tpl->tpl_vars['charset']->value;?>
" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $_smarty_tpl->tpl_vars['companyname']->value;?>
 - <?php echo $_smarty_tpl->tpl_vars['pagetitle']->value;?>
</title>

    <link href="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['assetPath'][0], array( array('file'=>'all.min.css'),$_smarty_tpl ) );?>
?v=<?php echo $_smarty_tpl->tpl_vars['versionHash']->value;?>
" rel="stylesheet">
    <link href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/assets/fonts/css/fontawesome.min.css" rel="stylesheet">
    <link href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/assets/fonts/css/fontawesome-solid.min.css" rel="stylesheet">
    <link href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/assets/fonts/css/fontawesome-regular.min.css" rel="stylesheet">
    <link href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/assets/fonts/css/fontawesome-light.min.css" rel="stylesheet">
    <link href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/assets/fonts/css/fontawesome-brands.min.css" rel="stylesheet">
    <link href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/assets/fonts/css/fontawesome-duotone.min.css" rel="stylesheet">
    <link href="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['assetPath'][0], array( array('file'=>'invoice.css'),$_smarty_tpl ) );?>
" rel="stylesheet">
    <?php echo '<script'; ?>
>var whmcsBaseUrl = "<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
";<?php echo '</script'; ?>
>
    <?php echo '<script'; ?>
 src="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['assetPath'][0], array( array('file'=>'scripts.min.js'),$_smarty_tpl ) );?>
?v=<?php echo $_smarty_tpl->tpl_vars['versionHash']->value;?>
"><?php echo '</script'; ?>
>

</head>
<body>

    <div class="container-fluid invoice-container">

        <?php if ($_smarty_tpl->tpl_vars['invalidInvoiceIdRequested']->value) {?>

            <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/panel.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"danger",'headerTitle'=>$_smarty_tpl->tpl_vars['LANG']->value['error'],'bodyContent'=>$_smarty_tpl->tpl_vars['LANG']->value['invoiceserror'],'bodyTextCenter'=>true), 0, true);
?>

        <?php } else { ?>

            <div class="row invoice-header">
                <div class="invoice-col">

                    <?php if ($_smarty_tpl->tpl_vars['logo']->value) {?>
                        <p><img src="<?php echo $_smarty_tpl->tpl_vars['logo']->value;?>
" title="<?php echo $_smarty_tpl->tpl_vars['companyname']->value;?>
" /></p>
                    <?php } else { ?>
                        <h2><?php echo $_smarty_tpl->tpl_vars['companyname']->value;?>
</h2>
                    <?php }?>
                    <h3><?php echo $_smarty_tpl->tpl_vars['pagetitle']->value;?>
</h3>

                </div>
                <div class="invoice-col text-center">

                    <div class="invoice-status">
                        <?php if ($_smarty_tpl->tpl_vars['status']->value == "Draft") {?>
                            <span class="draft"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesdraft'];?>
</span>
                        <?php } elseif ($_smarty_tpl->tpl_vars['status']->value == "Unpaid") {?>
                            <span class="unpaid"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesunpaid'];?>
</span>
                        <?php } elseif ($_smarty_tpl->tpl_vars['status']->value == "Paid") {?>
                            <span class="paid"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicespaid'];?>
</span>
                        <?php } elseif ($_smarty_tpl->tpl_vars['status']->value == "Refunded") {?>
                            <span class="refunded"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesrefunded'];?>
</span>
                        <?php } elseif ($_smarty_tpl->tpl_vars['status']->value == "Cancelled") {?>
                            <span class="cancelled"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicescancelled'];?>
</span>
                        <?php } elseif ($_smarty_tpl->tpl_vars['status']->value == "Collections") {?>
                            <span class="collections"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicescollections'];?>
</span>
                        <?php } elseif ($_smarty_tpl->tpl_vars['status']->value == "Payment Pending") {?>
                            <span class="paid"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesPaymentPending'];?>
</span>
                        <?php }?>
                    </div>

                    <?php if ($_smarty_tpl->tpl_vars['status']->value == "Unpaid" || $_smarty_tpl->tpl_vars['status']->value == "Draft") {?>
                        <div class="small-text">
                            <?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesdatedue'];?>
: <?php echo $_smarty_tpl->tpl_vars['datedue']->value;?>

                        </div>
                        <div class="payment-btn-container hidden-print" align="center">
                            <?php echo $_smarty_tpl->tpl_vars['paymentbutton']->value;?>

                        </div>
                    <?php }?>

                </div>
            </div>

            <hr>

                        <?php if ((isset($_smarty_tpl->tpl_vars['customAlert']->value)) && is_array($_smarty_tpl->tpl_vars['customAlert']->value)) {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/panel.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>htmlspecialchars((string)$_smarty_tpl->tpl_vars['customAlert']->value['type'], ENT_QUOTES, 'UTF-8', true),'headerTitle'=>htmlspecialchars((string)$_smarty_tpl->tpl_vars['customAlert']->value['title'], ENT_QUOTES, 'UTF-8', true),'bodyContent'=>htmlspecialchars((string)$_smarty_tpl->tpl_vars['customAlert']->value['message'], ENT_QUOTES, 'UTF-8', true),'bodyTextCenter'=>true), 0, true);
?>
            <?php } elseif ($_smarty_tpl->tpl_vars['paymentSuccessAwaitingNotification']->value) {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/panel.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"success",'headerTitle'=>$_smarty_tpl->tpl_vars['LANG']->value['success'],'bodyContent'=>$_smarty_tpl->tpl_vars['LANG']->value['invoicePaymentSuccessAwaitingNotify'],'bodyTextCenter'=>true), 0, true);
?>
            <?php } elseif ($_smarty_tpl->tpl_vars['paymentSuccess']->value) {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/panel.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"success",'headerTitle'=>$_smarty_tpl->tpl_vars['LANG']->value['success'],'bodyContent'=>$_smarty_tpl->tpl_vars['LANG']->value['invoicepaymentsuccessconfirmation'],'bodyTextCenter'=>true), 0, true);
?>
            <?php } elseif ($_smarty_tpl->tpl_vars['paymentInititated']->value) {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/panel.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"info",'headerTitle'=>$_smarty_tpl->tpl_vars['LANG']->value['success'],'bodyContent'=>$_smarty_tpl->tpl_vars['LANG']->value['invoicePaymentInitiated'],'bodyTextCenter'=>true), 0, true);
?>
            <?php } elseif ($_smarty_tpl->tpl_vars['pendingReview']->value) {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/panel.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"info",'headerTitle'=>$_smarty_tpl->tpl_vars['LANG']->value['success'],'bodyContent'=>$_smarty_tpl->tpl_vars['LANG']->value['invoicepaymentpendingreview'],'bodyTextCenter'=>true), 0, true);
?>
            <?php } elseif ($_smarty_tpl->tpl_vars['paymentFailed']->value) {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/panel.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"danger",'headerTitle'=>$_smarty_tpl->tpl_vars['LANG']->value['error'],'bodyContent'=>$_smarty_tpl->tpl_vars['LANG']->value['invoicepaymentfailedconfirmation'],'bodyTextCenter'=>true), 0, true);
?>
            <?php } elseif ($_smarty_tpl->tpl_vars['offlineReview']->value) {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/panel.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"info",'headerTitle'=>$_smarty_tpl->tpl_vars['LANG']->value['success'],'bodyContent'=>$_smarty_tpl->tpl_vars['LANG']->value['invoiceofflinepaid'],'bodyTextCenter'=>true), 0, true);
?>
            <?php }?>

            <div class="row">
                <div class="invoice-col right">
                    <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicespayto'];?>
</strong>
                    <address class="small-text">
                        <?php echo $_smarty_tpl->tpl_vars['payto']->value;?>

                        <?php if ($_smarty_tpl->tpl_vars['taxCode']->value) {?><br /><?php echo $_smarty_tpl->tpl_vars['taxIdLabel']->value;?>
: <?php echo $_smarty_tpl->tpl_vars['taxCode']->value;
}?>
                    </address>
                </div>
                <div class="invoice-col">
                    <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesinvoicedto'];?>
</strong>
                    <address class="small-text">
                        <?php if ($_smarty_tpl->tpl_vars['clientsdetails']->value['companyname']) {
echo $_smarty_tpl->tpl_vars['clientsdetails']->value['companyname'];?>
<br /><?php }?>
                        <?php echo $_smarty_tpl->tpl_vars['clientsdetails']->value['firstname'];?>
 <?php echo $_smarty_tpl->tpl_vars['clientsdetails']->value['lastname'];?>
<br />
                        <?php echo $_smarty_tpl->tpl_vars['clientsdetails']->value['address1'];?>
, <?php echo $_smarty_tpl->tpl_vars['clientsdetails']->value['address2'];?>
<br />
                        <?php echo $_smarty_tpl->tpl_vars['clientsdetails']->value['city'];?>
, <?php echo $_smarty_tpl->tpl_vars['clientsdetails']->value['state'];?>
, <?php echo $_smarty_tpl->tpl_vars['clientsdetails']->value['postcode'];?>
<br />
                        <?php echo $_smarty_tpl->tpl_vars['clientsdetails']->value['country'];?>

                        <?php if ($_smarty_tpl->tpl_vars['clientsdetails']->value['tax_id']) {?>
                            <br /><?php echo $_smarty_tpl->tpl_vars['taxIdLabel']->value;?>
: <?php echo $_smarty_tpl->tpl_vars['clientsdetails']->value['tax_id'];?>

                        <?php }?>
                        <?php if ($_smarty_tpl->tpl_vars['customfields']->value) {?>
                        <br /><br />
                        <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['customfields']->value, 'customfield');
$_smarty_tpl->tpl_vars['customfield']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['customfield']->value) {
$_smarty_tpl->tpl_vars['customfield']->do_else = false;
?>
                        <?php echo $_smarty_tpl->tpl_vars['customfield']->value['fieldname'];?>
: <?php echo $_smarty_tpl->tpl_vars['customfield']->value['value'];?>
<br />
                        <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                        <?php }?>
                    </address>
                </div>
            </div>

            <div class="row">
                <div class="invoice-col right">
                    <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['paymentmethod'];?>
</strong><br>
                    <span class="small-text" data-role="paymethod-info">
                        <?php if ($_smarty_tpl->tpl_vars['status']->value == "Unpaid" && $_smarty_tpl->tpl_vars['allowchangegateway']->value) {?>
                            <form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>
?id=<?php echo $_smarty_tpl->tpl_vars['invoiceid']->value;?>
" class="form-inline">
                                <?php echo $_smarty_tpl->tpl_vars['gatewaydropdown']->value;?>

                            </form>
                        <?php } else { ?>
                            <?php echo $_smarty_tpl->tpl_vars['paymentmethod']->value;
if ($_smarty_tpl->tpl_vars['paymethoddisplayname']->value) {?> (<?php echo $_smarty_tpl->tpl_vars['paymethoddisplayname']->value;?>
)<?php }?>
                        <?php }?>
                    </span>
                    <br /><br />
                </div>
                <div class="invoice-col">
                    <strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesdatecreated'];?>
</strong><br>
                    <span class="small-text">
                        <?php echo $_smarty_tpl->tpl_vars['date']->value;?>
<br><br>
                    </span>
                </div>
            </div>

            <br />

            <?php if ($_smarty_tpl->tpl_vars['manualapplycredit']->value) {?>
                <div class="panel panel-success">
                    <div class="panel-heading">
                        <h3 class="panel-title"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoiceaddcreditapply'];?>
</strong></h3>
                    </div>
                    <div class="panel-body">
                        <form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>
?id=<?php echo $_smarty_tpl->tpl_vars['invoiceid']->value;?>
">
                            <input type="hidden" name="applycredit" value="true" />
                            <?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoiceaddcreditdesc1'];?>
 <strong><?php echo $_smarty_tpl->tpl_vars['totalcredit']->value;?>
</strong>. <?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoiceaddcreditdesc2'];?>
. <?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoiceaddcreditamount'];?>
:
                            <div class="row">
                                <div class="col-xs-8 col-xs-offset-2 col-sm-4 col-sm-offset-4">
                                    <div class="input-group">
                                        <input type="text" name="creditamount" value="<?php echo $_smarty_tpl->tpl_vars['creditamount']->value;?>
" class="form-control" />
                                        <span class="input-group-btn">
                                            <input type="submit"
                                                   value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoiceaddcreditapply'];?>
"
                                                   class="btn btn-success"
                                                   id="btnInvoiceAddCreditApply"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            <?php }?>

            <?php if ($_smarty_tpl->tpl_vars['notes']->value) {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/panel.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"info",'headerTitle'=>$_smarty_tpl->tpl_vars['LANG']->value['invoicesnotes'],'bodyContent'=>$_smarty_tpl->tpl_vars['notes']->value), 0, true);
?>
            <?php }?>

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicelineitems'];?>
</strong></h3>
                </div>
                <div class="panel-body">
                    <div class="table-responsive">
                        <table class="table table-condensed">
                            <thead>
                                <tr>
                                    <td><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesdescription'];?>
</strong></td>
                                    <td width="20%" class="text-center"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesamount'];?>
</strong></td>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['invoiceitems']->value, 'item');
$_smarty_tpl->tpl_vars['item']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->tpl_vars['item']->do_else = false;
?>
                                    <tr>
                                        <td><?php echo $_smarty_tpl->tpl_vars['item']->value['description'];
if ($_smarty_tpl->tpl_vars['item']->value['taxed'] == "true") {?> *<?php }?></td>
                                        <td class="text-center"><?php echo $_smarty_tpl->tpl_vars['item']->value['amount'];?>
</td>
                                    </tr>
                                <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                                <tr>
                                    <td class="total-row text-right"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicessubtotal'];?>
</strong></td>
                                    <td class="total-row text-center"><?php echo $_smarty_tpl->tpl_vars['subtotal']->value;?>
</td>
                                </tr>
                                <?php if ($_smarty_tpl->tpl_vars['taxname']->value) {?>
                                    <tr>
                                        <td class="total-row text-right"><strong><?php echo $_smarty_tpl->tpl_vars['taxrate']->value;?>
% <?php echo $_smarty_tpl->tpl_vars['taxname']->value;?>
</strong></td>
                                        <td class="total-row text-center"><?php echo $_smarty_tpl->tpl_vars['tax']->value;?>
</td>
                                    </tr>
                                <?php }?>
                                <?php if ($_smarty_tpl->tpl_vars['taxname2']->value) {?>
                                    <tr>
                                        <td class="total-row text-right"><strong><?php echo $_smarty_tpl->tpl_vars['taxrate2']->value;?>
% <?php echo $_smarty_tpl->tpl_vars['taxname2']->value;?>
</strong></td>
                                        <td class="total-row text-center"><?php echo $_smarty_tpl->tpl_vars['tax2']->value;?>
</td>
                                    </tr>
                                <?php }?>
                                <tr>
                                    <td class="total-row text-right"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicestotal'];?>
</strong></td>
                                    <td class="total-row text-center"><?php echo $_smarty_tpl->tpl_vars['invoiceamount']->value;?>
</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <?php if ($_smarty_tpl->tpl_vars['taxrate']->value) {?>
                <p>* <?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicestaxindicator'];?>
</p>
            <?php }?>

            <hr />

            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['billing']['ledger']['title'];?>
</strong></h3>
                </div>
                <div class="panel-body">
                    <div class="table-responsive transactions-container">
                        <table class="table table-condensed">
                            <thead>
                            <tr>
                                <td class="text-center"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['billing']['ledger']['date'];?>
</strong></td>
                                <td class="text-center"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['billing']['ledger']['type'];?>
</strong></td>
                                <td class="text-center"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['billing']['ledger']['reference'];?>
</strong></td>
                                <td class="text-center"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicestransamount'];?>
</strong></td>
                            </tr>
                            </thead>
                            <tbody>
                            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['transactions']->value, 'transaction');
$_smarty_tpl->tpl_vars['transaction']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['transaction']->value) {
$_smarty_tpl->tpl_vars['transaction']->do_else = false;
?>
                                <tr>
                                    <td class="text-center"><?php echo $_smarty_tpl->tpl_vars['transaction']->value['date'];?>
</td>
                                    <td class="text-center">
                                        <?php if ($_smarty_tpl->tpl_vars['transaction']->value['gateway']) {?>
                                            <?php echo $_smarty_tpl->tpl_vars['transaction']->value['gateway'];?>
 &mdash;
                                        <?php }?>
                                        <?php echo $_smarty_tpl->tpl_vars['transaction']->value['typeLabel'];?>

                                    </td>
                                    <td class="text-center">
                                        <?php if ($_smarty_tpl->tpl_vars['transaction']->value['referenceHref']) {?>
                                        <a href="<?php echo $_smarty_tpl->tpl_vars['transaction']->value['referenceHref'];?>
" target="_blank">
                                            <?php }?>
                                            <?php if ($_smarty_tpl->tpl_vars['transaction']->value['isCreditNote']) {?>
                                                <?php echo $_smarty_tpl->tpl_vars['LANG']->value['billing']['creditnote'];?>

                                            <?php } elseif ($_smarty_tpl->tpl_vars['transaction']->value['isDebitNote']) {?>
                                                <?php echo $_smarty_tpl->tpl_vars['LANG']->value['billing']['debitnote'];?>

                                            <?php }?>
                                            <?php echo smarty_modifier_truncate($_smarty_tpl->tpl_vars['transaction']->value['referenceId'],24,"...",false,true);?>

                                            <?php if ($_smarty_tpl->tpl_vars['transaction']->value['referenceHref']) {?>
                                        </a>
                                        <?php }?>
                                    </td>
                                    <td class="text-center"><?php echo $_smarty_tpl->tpl_vars['transaction']->value['amount'];?>
</td>
                                </tr>
                                <?php
}
if ($_smarty_tpl->tpl_vars['transaction']->do_else) {
?>
                                <tr>
                                    <td class="text-center" colspan="4"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicestransnonefound'];?>
</td>
                                </tr>
                            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                            <tr>
                                <td class="total-row text-right" colspan="3"><strong><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesbalance'];?>
</strong></td>
                                <td class="total-row text-center"><?php echo $_smarty_tpl->tpl_vars['balance']->value;?>
</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <?php if ((isset($_smarty_tpl->tpl_vars['invoiceQrHtml']->value)) && !empty($_smarty_tpl->tpl_vars['invoiceQrHtml']->value)) {?>
                <div class="invoice-qr-wrapper mt-3 mb-4">
                    <?php echo $_smarty_tpl->tpl_vars['invoiceQrHtml']->value;?>

                </div>
            <?php }?>

            <div class="pull-right btn-group btn-group-sm hidden-print">
                <a href="javascript:window.print()" class="btn btn-default"><i class="fas fa-print"></i> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['print'];?>
</a>
                <a href="dl.php?type=i&amp;id=<?php echo $_smarty_tpl->tpl_vars['invoiceid']->value;?>
" class="btn btn-default"><i class="fas fa-download"></i> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesdownload'];?>
</a>
            </div>

        <?php }?>

    </div>

    <p class="text-center hidden-print"><a href="clientarea.php?action=invoices"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['invoicesbacktoclientarea'];?>
</a></a></p>

    <div id="fullpage-overlay" class="hidden">
        <div class="outer-wrapper">
            <div class="inner-wrapper">
                <img src="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/assets/img/overlay-spinner.svg">
                <br>
                <span class="msg"></span>
            </div>
        </div>
    </div>

</body>
</html>
<?php }
}
