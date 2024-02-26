const Message = require('./message.js');
const Command = require('./command.js');

class Rover {
   // Write code here!
   constructor(position)
   {
      this.position = position;
      this.mode = 'NORMAL';
      this.generatorWatts = 110;
   }
   receiveMessage(message)
   {    
      let commands = message.commands;     
      let result = [];
      for(let i = 0; i < commands.length; i++){
         
         if(commands[i].commandType == 'STATUS_CHECK'){
            result.push({
               completed: true,
               roverStatus: {mode: this.mode, generatorWatts: this.generatorWatts, position: this.position}
            });
         } else if (commands[i].commandType == 'MODE_CHANGE') {
            this.mode = commands[i].value;
            result.push({
               completed: true
            });
         } else if(commands[i].commandType == 'MOVE'){
            if(this.mode == 'LOW_POWER') {
               result.push({
                  completed: false
               });
            } else {
            this.position = commands[i].value;
            result.push({
               completed: true
            });
            }
         }
      }
      
      let response = {
            message: message.name,
            results: result           
      }
      return response;
   }
}


// let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
// let message = new Message('Test message with two commands', commands);
// let rover = new Rover(98382);    // Passes 98382 as the rover's position.
// let response = rover.receiveMessage(message);

// console.log(JSON.stringify(response,null,2));

let commands = [
   new Command('MOVE', 4321),
   new Command('STATUS_CHECK'),
   new Command('MODE_CHANGE', 'LOW_POWER'),
   new Command('MOVE', 3579),
   new Command('STATUS_CHECK')
];
let message = new Message('Test message with five commands', commands);
let rover = new Rover(98382);    // Passes 98382 as the rover's position.
let response = rover.receiveMessage(message);
console.log(JSON.stringify(response,null,2));

module.exports = Rover;