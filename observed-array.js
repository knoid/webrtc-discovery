const EventEmitter = require('events');

class ObservedArrayEventEmitter extends EventEmitter {
  cancel() {
    this.emit('cancel');
  }
}

module.exports = class ObservedArray {
  constructor() {
    this._array = [];
    this._observers = [];
  }

  add(data) {
    this._array.push(data);
    this._observers.forEach((observer) => {
      observer.emit('add', data);
    });
  }

  find(func) {
    return this._array.find(func);
  }

  observe() {
    const eventEmitter = new ObservedArrayEventEmitter();
    eventEmitter.once('cancel', this._removeObserver.bind(this, eventEmitter));
    this._observers.push(eventEmitter);

    process.nextTick(() => {
      this._array.forEach((elem) => {
        eventEmitter.emit('add', elem);
      });
    });

    return eventEmitter;
  }

  remove(func) {
    const index = this._array.findIndex(func);
    const [ removedElement ] = this._array.splice(index, 1);

    process.nextTick(() => {
      this._observers.forEach((observer) => {
        observer.emit('remove', removedElement);
      });
    });

    return removedElement;
  }

  _removeObserver(eventEmitter) {
    const observerIndex = this._observers.findIndex(o => o === eventEmitter);
    this._observers.splice(observerIndex, 1);
  }
}
