Template.server_pm_item.rendered = function () {
  Session.set("lastAccessedPm-" + this.data.server_id + '_' + this.data.from);
};

Template.server_pm_menu.events = {
  'click .pm-remove': function (e) {
    var user = Meteor.user();
    var $target = $(e.target);
    var pm_id = $(e.target).parents('li').find(
      '.pm.server-room').attr('id');
    var user_server_id = $target.data('server-id');
    var nick = $target.data('user-nick');
    var profile = user.profile;
    var userpms=UserPms.findOne({user_id: user._id});
    var pms = userpms.pms;
     var server = UserServers.findOne({_id: user_server_id});
    var server_name = server.name;
    delete pms[nick];
    UserPms.upsert(
      {user_id: user._id,
       user_server_id: user_server_id,
       user_server_name: server_name,
       user: user.username},
       {$set: {pms: pms}});

  }
}

Template.server_pm_item.helpers({
  isPmActive: function () {
    var room = Session.get('room') || {};
    if (room.roomtype == 'pm' && room.server_id == this.server_id &&
        room.nick == this.name)
      return true;
  }
});

Handlebars.registerHelper('pms', function (id) {
  var server = UserServers.findOne({_id: id});
  var user = Meteor.user();
  var pms = [];
   var userpms = UserPms.findOne({user_id: user._id});
  try {
    var pms = userpms.pms;
  } catch (err) {}
  var return_pms = [];
  for (nick in pms)
    return_pms.push({name: nick, server_id: server._id, room_id: server._id + '_' + nick});
  return return_pms;
});

Handlebars.registerHelper('currentPM', function () {
  var server = UserServers.findOne({_id: Session.get('server_id')});
  var user = Meteor.user();
  if (Session.get('roomtype') === 'pm') {
    var room_id = Session.get('room_id');
    var server_id = room_id.split('_')[0];
    var nick = room_id.split('_')[1];
    return {name: nick, server_id: server._id, room_id: server._id + '_' + nick};
  }
});