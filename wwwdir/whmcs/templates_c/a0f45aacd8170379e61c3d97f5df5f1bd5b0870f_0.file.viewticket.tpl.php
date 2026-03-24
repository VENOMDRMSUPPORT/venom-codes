<?php
/* Smarty version 4.5.3, created on 2026-03-24 17:16:20
  from '/home/venom/wwwdir/templates/twenty-one/viewticket.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.5.3',
  'unifunc' => 'content_69c2c6e4ba22a6_93966579',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'a0f45aacd8170379e61c3d97f5df5f1bd5b0870f' => 
    array (
      0 => '/home/venom/wwwdir/templates/twenty-one/viewticket.tpl',
      1 => 1773235103,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_69c2c6e4ba22a6_93966579 (Smarty_Internal_Template $_smarty_tpl) {
if ($_smarty_tpl->tpl_vars['invalidTicketId']->value) {?>
    <?php ob_start();
echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'thereisaproblem'),$_smarty_tpl ) );
$_prefixVariable1=ob_get_clean();
ob_start();
echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketinvalid'),$_smarty_tpl ) );
$_prefixVariable2=ob_get_clean();
$_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"danger",'title'=>$_prefixVariable1,'msg'=>$_prefixVariable2,'textcenter'=>true), 0, true);
} else { ?>
    <?php if ($_smarty_tpl->tpl_vars['closedticket']->value) {?>
        <?php ob_start();
echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketclosedmsg'),$_smarty_tpl ) );
$_prefixVariable3=ob_get_clean();
$_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"warning",'msg'=>$_prefixVariable3,'textcenter'=>true), 0, true);
?>
    <?php }?>

    <?php if ($_smarty_tpl->tpl_vars['errormessage']->value) {?>
        <?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['template']->value)."/includes/alert.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('type'=>"error",'errorshtml'=>$_smarty_tpl->tpl_vars['errormessage']->value), 0, true);
?>
    <?php }
}?>

<?php if (!$_smarty_tpl->tpl_vars['invalidTicketId']->value) {?>
    <div class="card view-ticket">
        <div class="card-body p-3">
            <h3 class="card-title">
                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsviewticket'),$_smarty_tpl ) );?>
 #<?php echo $_smarty_tpl->tpl_vars['tid']->value;?>

                <div class="ticket-actions float-sm-right mt-3 mt-sm-0">
                    <button id="ticketReply" type="button" class="btn btn-default btn-sm" onclick="smoothScroll('#ticketReplyContainer')">
                        <i class="fas fa-pencil-alt fa-fw"></i>
                        <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsreply'),$_smarty_tpl ) );?>

                    </button>
                    <?php if ($_smarty_tpl->tpl_vars['showCloseButton']->value) {?>
                        <?php if ($_smarty_tpl->tpl_vars['closedticket']->value) {?>
                            <button class="btn btn-danger btn-sm" disabled="disabled">
                                <i class="fas fa-times fa-fw"></i>
                                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsstatusclosed'),$_smarty_tpl ) );?>

                            </button>
                        <?php } else { ?>
                            <button class="btn btn-danger btn-sm" onclick="window.location='?tid=<?php echo $_smarty_tpl->tpl_vars['tid']->value;?>
&amp;c=<?php echo $_smarty_tpl->tpl_vars['c']->value;?>
&amp;closeticket=true&amp;token=<?php echo $_smarty_tpl->tpl_vars['token']->value;?>
'">
                                <i class="fas fa-times fa-fw"></i>
                                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsclose'),$_smarty_tpl ) );?>

                            </button>
                        <?php }?>
                    <?php }?>
                </div>
            </h3>

            <p>
                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketssubject'),$_smarty_tpl ) );?>
:
                <strong><?php echo $_smarty_tpl->tpl_vars['subject']->value;?>
</strong>
            </p>
        </div>

        <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['descreplies']->value, 'reply');
$_smarty_tpl->tpl_vars['reply']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['reply']->value) {
$_smarty_tpl->tpl_vars['reply']->do_else = false;
?>
            <div class="card-body">
                <div class="ticket-reply markdown-content<?php if ($_smarty_tpl->tpl_vars['reply']->value['admin']) {?> staff<?php }?>">
                    <div class="posted-by">
                        <?php ob_start();
echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>('support.requestor.').($_smarty_tpl->tpl_vars['reply']->value['requestor']['type_normalised'])),$_smarty_tpl ) );
$_prefixVariable4=ob_get_clean();
echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>"support.postedBy",'name'=>"<span class=\"posted-by-name\">".((string)$_smarty_tpl->tpl_vars['reply']->value['requestor']['name'])."</span>",'date'=>"<span class=\"posted-on\">".((string)$_smarty_tpl->tpl_vars['reply']->value['date'])."</span>",'requestorType'=>"<span class=\"label requestor-badge requestor-type-".((string)$_smarty_tpl->tpl_vars['reply']->value['requestor']['type_normalised'])." float-md-right\">".$_prefixVariable4."</span>"),$_smarty_tpl ) );?>

                    </div>
                    <div class="message p-3">
                        <?php echo $_smarty_tpl->tpl_vars['reply']->value['message'];?>

                        <?php if ($_smarty_tpl->tpl_vars['reply']->value['ipaddress']) {?>
                            <hr>
                            <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'support.ipAddress'),$_smarty_tpl ) );?>
: <?php echo $_smarty_tpl->tpl_vars['reply']->value['ipaddress'];?>

                        <?php }?>
                        <?php if ($_smarty_tpl->tpl_vars['reply']->value['id'] && $_smarty_tpl->tpl_vars['reply']->value['admin'] && $_smarty_tpl->tpl_vars['ratingenabled']->value) {?>
                            <div class="clearfix">
                                <?php if ($_smarty_tpl->tpl_vars['reply']->value['rating']) {?>
                                    <div class="rating-done">
                                        <?php
$_smarty_tpl->tpl_vars['rating'] = new Smarty_Variable(null, $_smarty_tpl->isRenderingCache);$_smarty_tpl->tpl_vars['rating']->step = 1;$_smarty_tpl->tpl_vars['rating']->total = (int) ceil(($_smarty_tpl->tpl_vars['rating']->step > 0 ? 5+1 - (1) : 1-(5)+1)/abs($_smarty_tpl->tpl_vars['rating']->step));
if ($_smarty_tpl->tpl_vars['rating']->total > 0) {
for ($_smarty_tpl->tpl_vars['rating']->value = 1, $_smarty_tpl->tpl_vars['rating']->iteration = 1;$_smarty_tpl->tpl_vars['rating']->iteration <= $_smarty_tpl->tpl_vars['rating']->total;$_smarty_tpl->tpl_vars['rating']->value += $_smarty_tpl->tpl_vars['rating']->step, $_smarty_tpl->tpl_vars['rating']->iteration++) {
$_smarty_tpl->tpl_vars['rating']->first = $_smarty_tpl->tpl_vars['rating']->iteration === 1;$_smarty_tpl->tpl_vars['rating']->last = $_smarty_tpl->tpl_vars['rating']->iteration === $_smarty_tpl->tpl_vars['rating']->total;?>
                                            <span class="star<?php if ((5-$_smarty_tpl->tpl_vars['reply']->value['rating']) < $_smarty_tpl->tpl_vars['rating']->value) {?> active<?php }?>"></span>
                                        <?php }
}
?>
                                        <div class="rated"><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'ticketreatinggiven'),$_smarty_tpl ) );?>
</div>
                                    </div>
                                <?php } else { ?>
                                    <div class="rating" ticketid="<?php echo $_smarty_tpl->tpl_vars['tid']->value;?>
" ticketkey="<?php echo $_smarty_tpl->tpl_vars['c']->value;?>
" ticketreplyid="<?php echo $_smarty_tpl->tpl_vars['reply']->value['id'];?>
">
                                        <span class="star" rate="5"></span>
                                        <span class="star" rate="4"></span>
                                        <span class="star" rate="3"></span>
                                        <span class="star" rate="2"></span>
                                        <span class="star" rate="1"></span>
                                    </div>
                                <?php }?>
                            </div>
                        <?php }?>
                    </div>
                    <?php if ($_smarty_tpl->tpl_vars['reply']->value['attachments']) {?>
                        <div class="attachments p-3">
                            <strong>
                                <i class="far fa-paperclip fa-fw"></i>
                                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsticketattachments'),$_smarty_tpl ) );?>
 (<?php echo call_user_func_array($_smarty_tpl->registered_plugins[ 'modifier' ][ 'count' ][ 0 ], array( $_smarty_tpl->tpl_vars['reply']->value['attachments'] ));?>
)
                            </strong>
                            <?php if ($_smarty_tpl->tpl_vars['reply']->value['attachments_removed']) {?> - <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'support.attachmentsRemoved'),$_smarty_tpl ) );
}?>
                            <ul class="attachment-list">
                                <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['reply']->value['attachments'], 'attachment', false, 'num');
$_smarty_tpl->tpl_vars['attachment']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['num']->value => $_smarty_tpl->tpl_vars['attachment']->value) {
$_smarty_tpl->tpl_vars['attachment']->do_else = false;
?>
                                    <li>
                                        <?php if ($_smarty_tpl->tpl_vars['reply']->value['attachments_removed']) {?>
                                            <span>
                                                <figure>
                                                    <i class="far fa-file-minus"></i>
                                                </figure>
                                                <div class="caption">
                                                    <?php echo $_smarty_tpl->tpl_vars['attachment']->value;?>

                                                </div>
                                            </span>
                                        <?php } else { ?>
                                            <a href="dl.php?type=<?php if ($_smarty_tpl->tpl_vars['reply']->value['id']) {?>ar&id=<?php echo $_smarty_tpl->tpl_vars['reply']->value['id'];
} else { ?>a&id=<?php echo $_smarty_tpl->tpl_vars['id']->value;
}?>&i=<?php echo $_smarty_tpl->tpl_vars['num']->value;?>
">
                                                <span>
                                                    <figure>
                                                        <i class="far fa-file"></i>
                                                    </figure>
                                                    <div class="caption">
                                                        <?php echo $_smarty_tpl->tpl_vars['attachment']->value;?>

                                                    </div>
                                                </span>
                                            </a>
                                        <?php }?>
                                    </li>
                                <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
                            </ul>
                        </div>
                    <?php }?>
                </div>
            </div>
        <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
    </div>

    <div class="card d-print-none" id="ticketReplyContainer">
        <div class="card-body">
            <h3 class="card-title"><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsreply'),$_smarty_tpl ) );?>
</h3>

            <form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>
?tid=<?php echo $_smarty_tpl->tpl_vars['tid']->value;?>
&amp;c=<?php echo $_smarty_tpl->tpl_vars['c']->value;?>
&amp;postreply=true" enctype="multipart/form-data" role="form" id="frmReply">
                <div class="row">
                    <div class="form-group col-md-4">
                        <label for="inputName"><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsclientname'),$_smarty_tpl ) );?>
</label>
                        <input class="form-control" type="text" name="replyname" id="inputName" value="<?php echo $_smarty_tpl->tpl_vars['replyname']->value;?>
"<?php if ($_smarty_tpl->tpl_vars['loggedin']->value) {?> disabled="disabled"<?php }?>>
                    </div>
                    <div class="form-group col-md-5">
                        <label for="inputEmail"><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsclientemail'),$_smarty_tpl ) );?>
</label>
                        <input class="form-control" type="text" name="replyemail" id="inputEmail" value="<?php echo $_smarty_tpl->tpl_vars['replyemail']->value;?>
"<?php if ($_smarty_tpl->tpl_vars['loggedin']->value) {?> disabled="disabled"<?php }?>>
                    </div>
                </div>

                <div class="form-group">
                    <label for="inputMessage"><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'contactmessage'),$_smarty_tpl ) );?>
</label>
                    <textarea name="replymessage" id="inputMessage" rows="12" class="form-control markdown-editor" data-auto-save-name="ctr<?php echo $_smarty_tpl->tpl_vars['tid']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['replymessage']->value;?>
</textarea>
                </div>

                <div class="form-group">
                    <label for="inputAttachments"><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsticketattachments'),$_smarty_tpl ) );?>
</label>
                    <div class="input-group mb-1 attachment-group">
                        <div class="custom-file">
                            <label class="custom-file-label text-truncate" for="inputAttachment1" data-default="Choose file">
                                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'chooseFile'),$_smarty_tpl ) );?>

                            </label>
                            <input type="file" class="custom-file-input" name="attachments[]" id="inputAttachment1">
                        </div>
                        <div class="input-group-append">
                            <button class="btn btn-default" type="button" id="btnTicketAttachmentsAdd">
                                <i class="fas fa-plus"></i>
                                <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'addmore'),$_smarty_tpl ) );?>

                            </button>
                        </div>
                    </div>
                    <div class="file-upload w-hidden">
                        <div class="input-group mb-1 attachment-group">
                            <div class="custom-file">
                                <label class="custom-file-label text-truncate">
                                    <?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'chooseFile'),$_smarty_tpl ) );?>

                                </label>
                                <input type="file" class="custom-file-input" name="attachments[]">
                            </div>
                        </div>
                    </div>
                    <div id="fileUploadsContainer"></div>
                    <div class="text-muted">
                        <small><?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsallowedextensions'),$_smarty_tpl ) );?>
: <?php echo $_smarty_tpl->tpl_vars['allowedfiletypes']->value;?>
 (<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>"maxFileSize",'fileSize'=>((string)$_smarty_tpl->tpl_vars['uploadMaxFileSize']->value)),$_smarty_tpl ) );?>
)</small>
                    </div>
                </div>

                <div class="form-group text-center">
                    <input class="btn btn-primary" type="submit" name="save" value="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'supportticketsticketsubmit'),$_smarty_tpl ) );?>
" />
                    <input class="btn btn-default" type="reset" value="<?php echo call_user_func_array( $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['lang'][0], array( array('key'=>'cancel'),$_smarty_tpl ) );?>
" onclick="jQuery('#ticketReply').click()" />
                </div>
            </form>

        </div>
    </div>
<?php }
}
}
