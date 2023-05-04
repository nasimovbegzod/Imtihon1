
class Todo {
  isCompleted = false;
  constructor(id, title, text, date, user_id, isCompleted){
this.id = id;
this.title = title;
this.text = text;
this.date = date;
this.user_id = user_id;
this.isCompleted = isCompleted;
  }
}

module.exports = Todo;