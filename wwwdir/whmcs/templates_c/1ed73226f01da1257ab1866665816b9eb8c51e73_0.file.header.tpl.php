<?php
/* Smarty version 4.5.3, created on 2026-03-25 17:40:02
  from '/home/venom/wwwdir/whmcs/templates/six/header.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.5.3',
  'unifunc' => 'content_69c41df2663f41_29452541',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '1ed73226f01da1257ab1866665816b9eb8c51e73' => 
    array (
      0 => '/home/venom/wwwdir/whmcs/templates/six/header.tpl',
      1 => 1773235103,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_69c41df2663f41_29452541 (Smarty_Internal_Template $_smarty_tpl) {
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="<?php echo $_smarty_tpl->tpl_vars['charset']->value;?>
" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php if ($_smarty_tpl->tpl_vars['kbarticle']->value['title']) {
echo $_smarty_tpl->tpl_vars['kbarticle']->value['title'];?>
 - <?php }
echo $_smarty_tpl->tpl_vars['pagetitle']->value;?>
 - <?php echo $_smarty_tpl->tpl_vars['companyname']->value;?>
</title>

    <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/head.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?>

    <?php echo $_smarty_tpl->tpl_vars['headoutput']->value;?>


</head>
<body data-phone-cc-input="<?php echo $_smarty_tpl->tpl_vars['phoneNumberInputStyle']->value;?>
">
<?php if ($_smarty_tpl->tpl_vars['captcha']->value) {
echo $_smarty_tpl->tpl_vars['captcha']->value->getMarkup();
}
echo $_smarty_tpl->tpl_vars['headeroutput']->value;?>


<section id="header">
    <div class="container">
        <ul class="top-nav">
            <?php if ($_smarty_tpl->tpl_vars['languagechangeenabled']->value && count($_smarty_tpl->tpl_vars['locales']->value) > 1) {?>
                <li>
                    <a href="#" class="choose-language" data-toggle="popover" id="languageChooser">
                        <?php echo $_smarty_tpl->tpl_vars['activeLocale']->value['localisedName'];?>

                        <b class="caret"></b>
                    </a>
                    <div id="languageChooserContent" class="hidden">
                        <ul>
                            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['locales']->value, 'locale');
$_smarty_tpl->tpl_vars['locale']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['locale']->value) {
$_smarty_tpl->tpl_vars['locale']->do_else = false;
?>
                                <li>
                                    <a href="<?php echo $_smarty_tpl->tpl_vars['currentpagelinkback']->value;?>
language=<?php echo $_smarty_tpl->tpl_vars['locale']->value['language'];?>
"><?php echo $_smarty_tpl->tpl_vars['locale']->value['localisedName'];?>
</a>
                                </li>
                            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                        </ul>
                    </div>
                </li>
            <?php }?>
            <?php if ($_smarty_tpl->tpl_vars['loggedin']->value) {?>
                <li>
                    <a href="#" data-toggle="popover" id="accountNotifications" data-placement="bottom">
                        <?php echo $_smarty_tpl->tpl_vars['LANG']->value['notifications'];?>

                        <?php if (count($_smarty_tpl->tpl_vars['clientAlerts']->value) > 0) {?>
                            <span class="label label-info"><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'notificationsnew'),$_smarty_tpl ) );?>
</span>
                        <?php }?>
                        <b class="caret"></b>
                    </a>
                    <div id="accountNotificationsContent" class="hidden">
                        <ul class="client-alerts">
                        <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['clientAlerts']->value, 'alert');
$_smarty_tpl->tpl_vars['alert']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['alert']->value) {
$_smarty_tpl->tpl_vars['alert']->do_else = false;
?>
                            <li>
                                <a href="<?php echo $_smarty_tpl->tpl_vars['alert']->value->getLink();?>
">
                                    <i class="fas fa-fw fa-<?php if ($_smarty_tpl->tpl_vars['alert']->value->getSeverity() == 'danger') {?>exclamation-circle<?php } elseif ($_smarty_tpl->tpl_vars['alert']->value->getSeverity() == 'warning') {?>exclamation-triangle<?php } elseif ($_smarty_tpl->tpl_vars['alert']->value->getSeverity() == 'info') {?>info-circle<?php } else { ?>check-circle<?php }?>"></i>
                                    <div class="message"><?php echo $_smarty_tpl->tpl_vars['alert']->value->getMessage();?>
</div>
                                </a>
                            </li>
                        <?php
}
if ($_smarty_tpl->tpl_vars['alert']->do_else) {
?>
                            <li class="none">
                                <?php echo $_smarty_tpl->tpl_vars['LANG']->value['notificationsnone'];?>

                            </li>
                        <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                        </ul>
                    </div>
                </li>
                <li class="primary-action">
                    <a href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/logout.php" class="btn">
                        <?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientareanavlogout'];?>

                    </a>
                </li>
            <?php } else { ?>
                <li>
                    <a href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/clientarea.php"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['login'];?>
</a>
                </li>
                <?php if ($_smarty_tpl->tpl_vars['condlinks']->value['allowClientRegistration']) {?>
                    <li>
                        <a href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/register.php"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['register'];?>
</a>
                    </li>
                <?php }?>
                <li class="primary-action">
                    <a href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/cart.php?a=view" class="btn">
                        <?php echo $_smarty_tpl->tpl_vars['LANG']->value['viewcart'];?>

                    </a>
                </li>
            <?php }?>
            <?php if ($_smarty_tpl->tpl_vars['adminMasqueradingAsClient']->value || $_smarty_tpl->tpl_vars['adminLoggedIn']->value) {?>
                <li>
                    <a href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/logout.php?returntoadmin=1" class="btn btn-logged-in-admin" data-toggle="tooltip" data-placement="bottom" title="<?php if ($_smarty_tpl->tpl_vars['adminMasqueradingAsClient']->value) {
echo $_smarty_tpl->tpl_vars['LANG']->value['adminmasqueradingasclient'];?>
 <?php echo $_smarty_tpl->tpl_vars['LANG']->value['logoutandreturntoadminarea'];
} else {
echo $_smarty_tpl->tpl_vars['LANG']->value['adminloggedin'];?>
 <?php echo $_smarty_tpl->tpl_vars['LANG']->value['returntoadminarea'];
}?>">
                        <i class="fas fa-sign-out-alt"></i>
                    </a>
                </li>
            <?php }?>
        </ul>

        <?php if ($_smarty_tpl->tpl_vars['assetLogoPath']->value) {?>
            <a href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/index.php" class="logo"><img src="<?php echo $_smarty_tpl->tpl_vars['assetLogoPath']->value;?>
" alt="<?php echo $_smarty_tpl->tpl_vars['companyname']->value;?>
"></a>
        <?php } else { ?>
            <a href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/index.php" class="logo logo-text"><?php echo $_smarty_tpl->tpl_vars['companyname']->value;?>
</a>
        <?php }?>

    </div>
</section>

<section id="main-menu">

    <nav id="nav" class="navbar navbar-default navbar-main" role="navigation">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#primary-nav">
                    <span class="sr-only"><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'toggleNav'),$_smarty_tpl ) );?>
</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="primary-nav">

                <ul class="nav navbar-nav">

                    <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/navbar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('navbar'=>$_smarty_tpl->tpl_vars['primaryNavbar']->value), 0, true);
?>

                </ul>

                <ul class="nav navbar-nav navbar-right">

                    <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/navbar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('navbar'=>$_smarty_tpl->tpl_vars['secondaryNavbar']->value), 0, true);
?>

                </ul>

            </div><!-- /.navbar-collapse -->
        </div>
    </nav>

</section>

<?php if ($_smarty_tpl->tpl_vars['templatefile']->value == 'homepage') {?>
    <section id="home-banner">
        <div class="container text-center">
            <?php if ($_smarty_tpl->tpl_vars['registerdomainenabled']->value || $_smarty_tpl->tpl_vars['transferdomainenabled']->value) {?>
                <h2><?php echo $_smarty_tpl->tpl_vars['LANG']->value['homebegin'];?>
</h2>
                <form method="post" action="domainchecker.php" id="frmDomainHomepage">
                    <input type="hidden" name="transfer" />
                    <div class="row">
                        <div class="<?php if ($_smarty_tpl->tpl_vars['showAdvancedSearchOptions']->value) {?>col-lg-6 col-lg-offset-3 <?php }?>col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
                            <div class="input-group input-group-lg<?php if ($_smarty_tpl->tpl_vars['showAdvancedSearchOptions']->value) {?> advanced-input<?php }?>">
                                <?php if ($_smarty_tpl->tpl_vars['showAdvancedSearchOptions']->value) {?>
                                    <textarea name="message"
                                              id="message"
                                              title="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'domainSearch.domainOrAiPrompt'),$_smarty_tpl ) );?>
"
                                              data-placement="left"
                                              data-trigger="manual"
                                              placeholder="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'domainSearch.domainOrAiInstruction'),$_smarty_tpl ) );?>
"></textarea>
                                <?php } else { ?>
                                    <input type="text" class="form-control" name="domain" placeholder="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['exampledomain'];?>
" autocapitalize="none" data-toggle="tooltip" data-placement="left" data-trigger="manual" title="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'orderForm.required'),$_smarty_tpl ) );?>
" />
                                <?php }?>
                                <span class="input-group-btn">
                                    <?php if ($_smarty_tpl->tpl_vars['registerdomainenabled']->value) {?>
                                        <input type="submit" class="btn search<?php echo $_smarty_tpl->tpl_vars['captcha']->value->getButtonClass($_smarty_tpl->tpl_vars['captchaForm']->value);?>
" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['search'];?>
" id="btnDomainSearch" />
                                    <?php }?>
                                    <?php if ($_smarty_tpl->tpl_vars['transferdomainenabled']->value) {?>
                                        <input type="submit" id="btnTransfer" class="btn transfer<?php echo $_smarty_tpl->tpl_vars['captcha']->value->getButtonClass($_smarty_tpl->tpl_vars['captchaForm']->value);?>
" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['domainstransfer'];?>
" />
                                    <?php }?>
                                </span>
                                <?php if ($_smarty_tpl->tpl_vars['showAdvancedSearchOptions']->value) {?>
                                    <span class="input-group input-group-lg<?php if ($_smarty_tpl->tpl_vars['showAdvancedSearchOptions']->value) {?> advanced-input<?php }?>">
                                        <select name="tlds[]" class="multiselect multiselect-filter" multiple="multiple" data-placeholder="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'domainSearch.tlds'),$_smarty_tpl ) );?>
" data-min-selection="1">
                                            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['tlds']->value, 'tld');
$_smarty_tpl->tpl_vars['tld']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['tld']->value) {
$_smarty_tpl->tpl_vars['tld']->do_else = false;
?>
                                                <option<?php if (in_array($_smarty_tpl->tpl_vars['tld']->value,$_smarty_tpl->tpl_vars['selectedTlds']->value)) {?> selected <?php if (count($_smarty_tpl->tpl_vars['selectedTlds']->value) <= 1) {?>disabled="disabled"<?php }
}?> value="<?php echo $_smarty_tpl->tpl_vars['tld']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['tld']->value;?>
</option>
                                            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                                        </select>
                                        <select name="maxLength" class="multiselect" data-placeholder="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'domainSearch.maxLength'),$_smarty_tpl ) );?>
">
                                            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['searchLengths']->value, 'len');
$_smarty_tpl->tpl_vars['len']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['len']->value) {
$_smarty_tpl->tpl_vars['len']->do_else = false;
?>
                                                <option value="<?php echo $_smarty_tpl->tpl_vars['len']->value;?>
" <?php if ($_smarty_tpl->tpl_vars['maxLength']->value === $_smarty_tpl->tpl_vars['len']->value) {?>selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['len']->value;?>
</option>
                                            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                                        </select>
                                        <label>
                                            <input type="checkbox" class="no-icheck" name="filter" <?php if ($_smarty_tpl->tpl_vars['safeSearchSelected']->value) {?>checked<?php }?>> <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>"domainSearch.safeSearch"),$_smarty_tpl ) );?>

                                        </label>
                                    </span>
                                <?php }?>
                            </div>
                        </div>
                    </div>

                    <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/captcha.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?>
                </form>
            <?php } else { ?>
                <h2><?php echo $_smarty_tpl->tpl_vars['LANG']->value['doToday'];?>
</h2>
            <?php }?>
        </div>
    </section>
    <div class="home-shortcuts">
        <div class="container">
            <div class="row">
                <div class="col-md-4 hidden-sm hidden-xs text-center">
                    <p class="lead">
                        <?php echo $_smarty_tpl->tpl_vars['LANG']->value['howcanwehelp'];?>

                    </p>
                </div>
                <div class="col-sm-12 col-md-8">
                    <ul>
                        <?php if ($_smarty_tpl->tpl_vars['registerdomainenabled']->value || $_smarty_tpl->tpl_vars['transferdomainenabled']->value) {?>
                            <li>
                                <a id="btnBuyADomain" href="domainchecker.php">
                                    <i class="fas fa-globe"></i>
                                    <p>
                                        <?php echo $_smarty_tpl->tpl_vars['LANG']->value['buyadomain'];?>
 <span>&raquo;</span>
                                    </p>
                                </a>
                            </li>
                        <?php }?>
                        <li>
                            <a id="btnOrderHosting" href="<?php echo $_smarty_tpl->tpl_vars['WEB_ROOT']->value;?>
/cart.php">
                                <i class="far fa-hdd"></i>
                                <p>
                                    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['orderhosting'];?>
 <span>&raquo;</span>
                                </p>
                            </a>
                        </li>
                        <li>
                            <a id="btnMakePayment" href="clientarea.php">
                                <i class="fas fa-credit-card"></i>
                                <p>
                                    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['makepayment'];?>
 <span>&raquo;</span>
                                </p>
                            </a>
                        </li>
                        <li>
                            <a id="btnGetSupport" href="submitticket.php">
                                <i class="far fa-envelope"></i>
                                <p>
                                    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['getsupport'];?>
 <span>&raquo;</span>
                                </p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
<?php }?>

<?php if ($_smarty_tpl->tpl_vars['showAdvancedSearchOptions']->value) {?>
    <?php echo '<script'; ?>
>
        $(document).ready(function() {
            jQuery('#frmDomainHomepage .multiselect').each(function () {
                const enableFiltering = $(this).hasClass('multiselect-filter');
                const minSelection = jQuery(this).data('min-selection');
                $(this).multiselect({
                    onChange: function (element) {
                        const closestSelect = element.closest('select');
                        const selectedOptions = closestSelect.find('option:selected');
                        if (minSelection === undefined) {
                            return;
                        }
                        const atMinOptions = selectedOptions.length <= minSelection;
                        const targetOptions = atMinOptions ? selectedOptions : closestSelect.find('option');
                        targetOptions.each(function () {
                            const inputElement = jQuery('input[value="' + jQuery(this).val() + '"]');
                            inputElement.prop('disabled', atMinOptions ? 'disabled' : false);
                        });
                    },
                    buttonText: function(options, select) {
                        return select.data('placeholder');
                    },
                    maxHeight: 200,
                    includeFilterClearBtn: false,
                    enableCaseInsensitiveFiltering: enableFiltering,
                });
            })
        });
    <?php echo '</script'; ?>
>
<?php }?>

<?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/validateuser.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
$_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/verifyemail.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?>

<section id="main-body">
    <div class="container<?php if ($_smarty_tpl->tpl_vars['skipMainBodyContainer']->value) {?>-fluid without-padding<?php }?>">
        <div class="row">

        <?php if (!$_smarty_tpl->tpl_vars['inShoppingCart']->value && ($_smarty_tpl->tpl_vars['primarySidebar']->value->hasChildren() || $_smarty_tpl->tpl_vars['secondarySidebar']->value->hasChildren())) {?>
            <?php if ($_smarty_tpl->tpl_vars['primarySidebar']->value->hasChildren() && !$_smarty_tpl->tpl_vars['skipMainBodyContainer']->value) {?>
                <div class="col-md-9 pull-md-right">
                    <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/pageheader.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['displayTitle']->value,'desc'=>$_smarty_tpl->tpl_vars['tagline']->value,'showbreadcrumb'=>true), 0, true);
?>
                </div>
            <?php }?>
            <div class="col-md-3 pull-md-left sidebar">
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/sidebar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('sidebar'=>$_smarty_tpl->tpl_vars['primarySidebar']->value), 0, true);
?>
            </div>
        <?php }?>
        <!-- Container for main page display content -->
        <div class="<?php if (!$_smarty_tpl->tpl_vars['inShoppingCart']->value && ($_smarty_tpl->tpl_vars['primarySidebar']->value->hasChildren() || $_smarty_tpl->tpl_vars['secondarySidebar']->value->hasChildren())) {?>col-md-9 pull-md-right<?php } else { ?>col-xs-12<?php }?> main-content">
            <?php if (!$_smarty_tpl->tpl_vars['primarySidebar']->value->hasChildren() && !$_smarty_tpl->tpl_vars['showingLoginPage']->value && !$_smarty_tpl->tpl_vars['inShoppingCart']->value && $_smarty_tpl->tpl_vars['templatefile']->value != 'homepage' && !$_smarty_tpl->tpl_vars['skipMainBodyContainer']->value) {?>
                <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/pageheader.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['displayTitle']->value,'desc'=>$_smarty_tpl->tpl_vars['tagline']->value,'showbreadcrumb'=>true), 0, true);
?>
            <?php }
}
}
