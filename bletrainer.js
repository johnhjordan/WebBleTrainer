// Bluetooth Bike Trainer Functions In This Section

let usingTrainer;
let myControl;
let wattValue;
let cadValue;

function Trainer() {
  usingTrainer = true;
if ("bluetooth" in navigator) {
if (bleConnected == false) {
navigator.bluetooth.requestDevice({ filters: [{
    services: [0x1826],
}]
}).then(function(device) {
    console.log('Name: ' + device.name);
    bluetoothDevice = device;
    bleConnected = true;
    return device.gatt.connect();
})
  .then(function(server) {
    console.log('Getting Service...');
    return server.getPrimaryService(0x1826);
  })
  .then(function(service) {
    console.log('Getting Characteristic...');
    myService = service;
    return service.getCharacteristic(0x2AD2);
  })
  .then(function(characteristic) {
    myPower = characteristic;
    return myPower.startNotifications().then(function (_) {
      console.log('> Notifications started');
      connected();
      myPower.addEventListener('characteristicvaluechanged', function (e) {
var dataView = e.target.value;
wattValue = dataView.getInt16(6,true);
//console.log(wattValue);
cadValue = dataView.getUint16(4,true);

});
   });
  }).then(function() {
myService.getCharacteristic(0x2AD9)
  .then(function(characteristic) {
    myControl = characteristic;
    myControl.startNotifications().then(function (_) {
      console.log('> Notifications started');
      SetPermission();
      myControl.addEventListener('characteristicvaluechanged', function (e) {
var dataViewControl = e.target.value;
});
  });
})
})
.catch(function(error) {
    console.log("Something went wrong. " + error);
});
} else {
  console.log('Disconnecting from Bluetooth Device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
    bleConnected = false;
};
}
} else {
window.alert("Web Bluetooth Not Supported In This Browser.  Supported Browsers Include: PC: Chrome & Edge (latest updates), MacOS: Chrome (latest update) Iphone: Bluefy, Android: Chrome, Android (latest updates)  If you are using one of these listed browsers, check for version updates.  Thank you for playing!");
}
};

function SetPermission() {
  if (usingTrainer) {
var bufferHandshake = new ArrayBuffer(1);
var viewHandshake = new DataView(bufferHandshake);
viewHandshake.setInt8(0,0);
value2 = Uint8Array.of(0);
myControl.writeValue(value2).then(value => {
    console.log('> Characteristic User Description changed to: ' + value);
    console.log(value);
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
console.log('Permission Set');
}
};

function SetSlope() {
  if (usingTrainer) {
    //console.log('setslope ran')
var bufferSimulation = new ArrayBuffer(7);
var viewSimulation = new DataView(bufferSimulation);
viewSimulation.setInt8(0,17,true); //control code
viewSimulation.setInt16(1,0,true); //wind speed
viewSimulation.setInt16(3,slopeValue*100,true); //slope
viewSimulation.setUint8(5,0,true); //rolling resistance
viewSimulation.setUint8(6,0,true); //wind resistance
myControl.writeValueWithResponse(bufferSimulation).then(value2 => {
    console.log('> Characteristic User Description changed to: ' + value2);
    console.log('write value ran')
  })
  .catch(error => {
    if (error == "NetworkError: Failed to execute 'writeValue' on 'BluetoothRemoteGATTCharacteristic': GATT Server is disconnected. Cannot perform GATT operations. (Re)connect first with `device.gatt.connect`.") {
    bleConnected = false;
    }
    console.log('Argh! ' + error);
  });
console.log(viewSimulation.getInt16(3,true));
console.log(slopeValue);
}
};

let usingPowerMeter;

function PowerMeter() {
  usingPowerMeter = true;
if ("bluetooth" in navigator) {
if (bleConnected == false) {
navigator.bluetooth.requestDevice({ filters: [{
    services: [0x1818],
}]
}).then(function(device) {
    console.log('Name: ' + device.name);
    bluetoothDevice = device;
    bleConnected = true;
    return device.gatt.connect();
})
  .then(function(server) {
    console.log('Getting Service...');
    return server.getPrimaryService(0x1818);
  })
  .then(function(service) {
    console.log('Getting Characteristic...');
    myService = service;
    return service.getCharacteristic(0x2A63);
  })
  .then(function(characteristic) {
    myPower = characteristic;
    return myPower.startNotifications().then(function (_) {
      console.log('> Notifications started');
      connected();
      myPower.addEventListener('characteristicvaluechanged', function (e) {
var dataView = e.target.value;
wattValue = dataView.getInt16(2,true);
//console.log(wattValue);
cadValue = dataView.getUint16(6,true);
});
   });
  })
.catch(function(error) {
    console.log("Something went wrong. " + error);
});
} else {
  console.log('Disconnecting from Bluetooth Device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
    bleConnected = false;
};
}
} else {
window.alert("Web Bluetooth Not Supported In This Browser.  Supported Browsers Include: PC: Chrome & Edge (latest updates), MacOS: Chrome (latest update) Iphone: Bluefy, Android: Chrome, Android (latest updates)  If you are using one of these listed browsers, check for version updates.  Thank you for playing!");
}
};

function connectBle() {
  if (usingTrainer) {
    Trainer();
  } else if (usingPowerMeter) {
    PowerMeter();
  }
}

function fakeBle() {
  skipBleBool = true;
  if (wattValue) {
    if (bluetoothDevice.gatt.connected) {
      bluetoothDevice.gatt.disconnect();
      bleConnected = false;
      myControl = false;
    };
  };
}