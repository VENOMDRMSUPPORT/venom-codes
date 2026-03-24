<?php
/* Smarty version 4.5.3, created on 2026-03-24 17:16:18
  from '/home/venom/wwwdir/templates/twenty-one/includes/sidebar.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.5.3',
  'unifunc' => 'content_69c2c6e259a730_67925903',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '4a407745af45d9756075e3d35e9d98fe5a56a3f5' => 
    array (
      0 => '/home/venom/wwwdir/templates/twenty-one/includes/sidebar.tpl',
      1 => 1773235103,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_69c2c6e259a730_67925903 (Smarty_Internal_Template $_smarty_tpl) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['sidebar']->value, 'item');
$_smarty_tpl->tpl_vars['item']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->tpl_vars['item']->do_else = false;
?>
    <div menuItemName="<?php echo $_smarty_tpl->tpl_vars['item']->value->getName();?>
" class="mb-3 card card-sidebar<?php if ($_smarty_tpl->tpl_vars['item']->value->getClass()) {?> <?php echo $_smarty_tpl->tpl_vars['item']->value->getClass();
}
if ($_smarty_tpl->tpl_vars['item']->value->getExtra('mobileSelect') && $_smarty_tpl->tpl_vars['item']->value->hasChildren()) {?> d-none d-md-block<?php }?>"<?php if ($_smarty_tpl->tpl_vars['item']->value->getAttribute('id')) {?> id="<?php echo $_smarty_tpl->tpl_vars['item']->value->getAttribute('id');?>
"<?php }?>>
        <div class="card-header">
            <h3 class="card-title m-0">
                <?php if ($_smarty_tpl->tpl_vars['item']->value->hasIcon()) {?><i class="<?php echo $_smarty_tpl->tpl_vars['item']->value->getIcon();?>
"></i>&nbsp;<?php }?>
                <?php echo $_smarty_tpl->tpl_vars['item']->value->getLabel();?>

                <?php if ($_smarty_tpl->tpl_vars['item']->value->hasBadge()) {?>&nbsp;<span class="badge float-right"><?php echo $_smarty_tpl->tpl_vars['item']->value->getBadge();?>
</span><?php }?>
                <i class="fas fa-chevron-up card-minimise float-right"></i>
            </h3>
        </div>
        <div class="collapsable-card-body">
            <?php if ($_smarty_tpl->tpl_vars['item']->value->hasBodyHtml()) {?>
                <div class="card-body">
                    <?php echo $_smarty_tpl->tpl_vars['item']->value->getBodyHtml();?>

                </div>
            <?php }?>
            <?php if ($_smarty_tpl->tpl_vars['item']->value->hasChildren()) {?>
                <div class="list-group list-group-flush d-md-flex<?php if ($_smarty_tpl->tpl_vars['item']->value->getChildrenAttribute('class')) {?> <?php echo $_smarty_tpl->tpl_vars['item']->value->getChildrenAttribute('class');
}?>" role="tablist">
                    <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['item']->value->getChildren(), 'childItem');
$_smarty_tpl->tpl_vars['childItem']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['childItem']->value) {
$_smarty_tpl->tpl_vars['childItem']->do_else = false;
?>
                        <?php if ($_smarty_tpl->tpl_vars['childItem']->value->getUri()) {?>
                            <a menuItemName="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getName();?>
"
                               href="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getUri();?>
"
                               class="list-group-item list-group-item-action<?php if ($_smarty_tpl->tpl_vars['childItem']->value->isDisabled()) {?> disabled<?php }
if ($_smarty_tpl->tpl_vars['childItem']->value->getClass()) {?> <?php echo $_smarty_tpl->tpl_vars['childItem']->value->getClass();
}
if ($_smarty_tpl->tpl_vars['childItem']->value->isCurrent()) {?> active<?php }?>"
                               <?php if ($_smarty_tpl->tpl_vars['childItem']->value->getAttribute('dataToggleTab')) {?>
                                   data-toggle="list" role="tab"
                               <?php }?>
                               <?php $_smarty_tpl->_assignInScope('customActionData', $_smarty_tpl->tpl_vars['childItem']->value->getAttribute('dataCustomAction'));?>
                               <?php if (is_array($_smarty_tpl->tpl_vars['customActionData']->value)) {?>
                                   data-active="<?php echo $_smarty_tpl->tpl_vars['customActionData']->value['active'];?>
"
                                   data-identifier="<?php echo $_smarty_tpl->tpl_vars['customActionData']->value['identifier'];?>
"
                                   data-serviceid="<?php echo $_smarty_tpl->tpl_vars['customActionData']->value['serviceid'];?>
"
                               <?php }?>
                               <?php if ($_smarty_tpl->tpl_vars['childItem']->value->getAttribute('target')) {?>
                                   target="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getAttribute('target');?>
"
                               <?php }?>
                               id="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getId();?>
"
                            >
                                <div class="sidebar-menu-item-wrapper">
                                    <?php if ($_smarty_tpl->tpl_vars['childItem']->value->hasIcon()) {?>
                                        <div class="sidebar-menu-item-icon-wrapper">
                                            <?php if (is_array($_smarty_tpl->tpl_vars['customActionData']->value)) {?>
                                                <span class="loading" style="display: none;">
                                                    <i class="fas fa-spinner fa-spin fa-fw"></i>
                                                </span>
                                            <?php }?>
                                            <i class="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getIcon();?>
 sidebar-menu-item-icon"></i>
                                        </div>
                                    <?php }?>
                                    <div class="sidebar-menu-item-label">
                                        <?php echo $_smarty_tpl->tpl_vars['childItem']->value->getLabel();?>

                                    </div>
                                    <?php if ($_smarty_tpl->tpl_vars['childItem']->value->hasBadge()) {?>
                                        <div class="sidebar-menu-item-badge">
                                            <span class="badge"><?php echo $_smarty_tpl->tpl_vars['childItem']->value->getBadge();?>
</span>
                                        </div>
                                    <?php }?>
                                </div>
                            </a>
                        <?php } else { ?>
                            <div menuItemName="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getName();?>
" class="list-group-item list-group-item-action<?php if ($_smarty_tpl->tpl_vars['childItem']->value->getClass()) {?> <?php echo $_smarty_tpl->tpl_vars['childItem']->value->getClass();
}?>" id="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getId();?>
">
                                <?php if ($_smarty_tpl->tpl_vars['childItem']->value->hasBadge()) {?><span class="badge float-right"><?php echo $_smarty_tpl->tpl_vars['childItem']->value->getBadge();?>
</span><?php }?>
                                <?php if ($_smarty_tpl->tpl_vars['childItem']->value->hasIcon()) {?><i class="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getIcon();?>
"></i>&nbsp;<?php }?>
                                <?php echo $_smarty_tpl->tpl_vars['childItem']->value->getLabel();?>

                            </div>
                        <?php }?>
                    <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                </div>
            <?php }?>
        </div>
        <?php if ($_smarty_tpl->tpl_vars['item']->value->hasFooterHtml()) {?>
            <div class="card-footer clearfix">
                <?php echo $_smarty_tpl->tpl_vars['item']->value->getFooterHtml();?>

            </div>
        <?php }?>
    </div>
    <?php if ($_smarty_tpl->tpl_vars['item']->value->getExtra('mobileSelect') && $_smarty_tpl->tpl_vars['item']->value->hasChildren()) {?>
                <div class="card d-block d-md-none <?php if ($_smarty_tpl->tpl_vars['item']->value->getClass()) {
echo $_smarty_tpl->tpl_vars['item']->value->getClass();
} else { ?>bg-light<?php }?>"<?php if ($_smarty_tpl->tpl_vars['item']->value->getAttribute('id')) {?> id="<?php echo $_smarty_tpl->tpl_vars['item']->value->getAttribute('id');?>
"<?php }?>>
            <div class="card-header">
                <h3 class="card-title">
                    <?php if ($_smarty_tpl->tpl_vars['item']->value->hasIcon()) {?><i class="<?php echo $_smarty_tpl->tpl_vars['item']->value->getIcon();?>
"></i>&nbsp;<?php }?>
                    <?php echo $_smarty_tpl->tpl_vars['item']->value->getLabel();?>

                    <?php if ($_smarty_tpl->tpl_vars['item']->value->hasBadge()) {?>&nbsp;<span class="badge float-right"><?php echo $_smarty_tpl->tpl_vars['item']->value->getBadge();?>
</span><?php }?>
                </h3>
            </div>
            <div class="card-body">
                <form role="form">
                    <select class="form-control" onchange="selectChangeNavigate(this)">
                        <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['item']->value->getChildren(), 'childItem');
$_smarty_tpl->tpl_vars['childItem']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['childItem']->value) {
$_smarty_tpl->tpl_vars['childItem']->do_else = false;
?>
                            <option menuItemName="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getName();?>
" value="<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getUri();?>
" class="list-group-item list-group-item-action" <?php if ($_smarty_tpl->tpl_vars['childItem']->value->isCurrent()) {?>selected="selected"<?php }?>>
                                <?php echo $_smarty_tpl->tpl_vars['childItem']->value->getLabel();?>

                                <?php if ($_smarty_tpl->tpl_vars['childItem']->value->hasBadge()) {?>(<?php echo $_smarty_tpl->tpl_vars['childItem']->value->getBadge();?>
)<?php }?>
                            </option>
                        <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                    </select>
                </form>
            </div>
            <?php if ($_smarty_tpl->tpl_vars['item']->value->hasFooterHtml()) {?>
                <div class="card-footer">
                    <?php echo $_smarty_tpl->tpl_vars['item']->value->getFooterHtml();?>

                </div>
            <?php }?>
        </div>
    <?php }
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}
