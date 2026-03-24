<?php
/* Smarty version 4.5.3, created on 2026-03-24 19:32:12
  from '/home/venom/wwwdir/whmcs/templates/six/login.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.5.3',
  'unifunc' => 'content_69c2e6bc9b40f1_22989990',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'ab8eb0faa9afdf5b9511549b7db357b60309a90b' => 
    array (
      0 => '/home/venom/wwwdir/whmcs/templates/six/login.tpl',
      1 => 1773235103,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_69c2e6bc9b40f1_22989990 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="logincontainer<?php if ($_smarty_tpl->tpl_vars['linkableProviders']->value) {?> with-social<?php }?>">

    <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/pageheader.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('title'=>$_smarty_tpl->tpl_vars['LANG']->value['login'],'desc'=>((string)$_smarty_tpl->tpl_vars['LANG']->value['restrictedpage'])), 0, true);
?>

    <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/flashmessage.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?>

    <div class="providerLinkingFeedback"></div>

    <div class="row">
        <div class="col-sm-<?php if ($_smarty_tpl->tpl_vars['linkableProviders']->value) {?>7<?php } else { ?>12<?php }?>">

            <form method="post" action="<?php echo routePath('login-validate');?>
" class="login-form" role="form">
                <div class="form-group">
                    <label for="inputEmail"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientareaemail'];?>
</label>
                    <input type="email" name="username" class="form-control" id="inputEmail" placeholder="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['enteremail'];?>
" autofocus>
                </div>

                <div class="form-group">
                    <label for="inputPassword"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientareapassword'];?>
</label>
                    <input type="password" name="password" class="form-control" id="inputPassword" placeholder="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['clientareapassword'];?>
" autocomplete="off" >
                </div>

                <div class="checkbox">
                    <label>
                        <input type="checkbox" name="rememberme" /> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['loginrememberme'];?>

                    </label>
                </div>
                <?php if ($_smarty_tpl->tpl_vars['captcha']->value->isEnabled()) {?>
                    <div class="text-center margin-bottom">
                        <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/captcha.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?>
                    </div>
                <?php }?>
                <div align="center">
                    <input id="login" type="submit" class="btn btn-primary<?php echo $_smarty_tpl->tpl_vars['captcha']->value->getButtonClass($_smarty_tpl->tpl_vars['captchaForm']->value);?>
" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['loginbutton'];?>
" /> <a href="<?php echo routePath('password-reset-begin');?>
" class="btn btn-default"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['forgotpw'];?>
</a>
                </div>
            </form>

        </div>
        <div class="col-sm-5<?php if (!$_smarty_tpl->tpl_vars['linkableProviders']->value) {?> hidden<?php }?>">
            <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/linkedaccounts.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('linkContext'=>"login",'customFeedback'=>true), 0, true);
?>
        </div>
    </div>
</div>
<?php }
}
