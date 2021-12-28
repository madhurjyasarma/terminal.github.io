const ASCII_TEXT = 
"████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗         ██╗   ██╗██╗\n"+
"╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║         ██║   ██║██║\n"+
"   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║         ██║   ██║██║\n"+
"   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║         ██║   ██║██║\n"+
"   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗    ╚██████╔╝██║\n"+
"   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝     ╚═════╝ ╚═╝\n"; 

const HELP = 
    '\nhelp                              :: to show this menu\n'
    +"iam <your name>                   :: for greeting\n"
    +"developer                         :: to know the Anonymous\n"
    +"advice                            :: to get a free advice\n"
    +"weather <city>                    :: check your city's weather\n"
    +"phone <country code><phone number>:: to get details of your number\n"
    +"alexa                             :: chat with alexa\n"
    +"whatsmyip                         :: to get details of your ip\n"
    +"gender                            :: to know your gender\n"
    +"ls, cd, cat                       :: directory access\n"


var term;

// Fake in memory filesystem
var fs = {
    'projects': {
        'baz.txt': 'Hello this is file baz.txt',
        'assamese.txt': " গোটেই নগৰখনৰ মানুহে এতিয়াৰ পৰাহে যেন শান্তিৰে উশাহ ল'লে। সেই দিনাখনৰ পৰা ডাঙৰ নগৰখনৰ মানুহবোৰক প্ৰতি ৰাতিপুৱা এটাকৈহে সাধু কোৱা হ'ল। নিশা মানুহবোৰে শুবলৈ যোৱাৰ আগত এটাকৈহে সাধু শুনিবলৈ পালে। কণমানি ছোৱালীজনী আৰু সেই বাইদেৱে বাস কৰা ডাঙৰ আৰু ব্যস্ত নগৰখনক পিছলৈ মানুহবোৰে- সাধু-নগৰী বুলি ক'বলৈ ধৰিলে। চহৰখনত বাস কৰা কোনো ব্যক্তিৰে সাধু কবলৈ সময় নাই। বাইদেউজনী আৰু কণমানি ছোৱালীজনীয়ে সাধুৰ এক নতুন পৰিবেশৰ সূচনা কৰিলে। এখন নগৰ কেনেকৈ সাধুনগৰীলৈ পৰিবৰ্তন ঘটিল জানিবৰ বাবে কিতাপখন পঢ়ক।",
        'foo.txt': "Hello, World!",
        'bar.txt': "Wellcome to the bar",
        "terminal": {
            "foo": {
                "bar.txt": "hello bar",
                "baz.txt": "baz content"
            }
        }
    }
};

var path = [];
var cwd = fs;
function restore_cwd(fs, path) {
    path = path.slice();
    while (path.length) {
        var dir_name = path.shift();
        if (!is_dir(fs[dir_name])) {
            playAudio()
            throw new Error('Internal Error Invalid directory ' +
                            $.terminal.escape_brackets(dir_name));
        }
        fs = fs[dir_name];
    }
    return fs;
}
function is_dir(obj) {
    return typeof obj === 'object';
}
function is_file(obj) {
    return typeof obj === 'string';
}
var commands = {
    iam: function (name) {
        this.echo('Hello, ' + name +
            '. Welcome to TERMINAL UI.');
    },
    developer: function () {
        this.echo('MVDZO X AVIN');
    },
    help: function () {
        playAudio();
        this.echo(showHelp());
    },
    hie: function (name) {
        this.echo(saysomething(name));
    },
    advice: function () {
        this.echo(fetchAdviceAPI());
    },    
    weather: function (city_name) {
        this.echo(weatherAPI(city_name));
    },
    phone: function (phoneNumber) {
        this.echo(phoneAPI(phoneNumber));
    },
    alexa: function () {
        this.echo(foaas());
    },
    gender: function () {
        this.echo(gender(name1));
    },
    whatsmyip : function () {
        this.echo(whatsmyIP());
    },
    cd: function(dir) {
        this.pause();
        if (dir === '/') {
            path = [];
            cwd = restore_cwd(fs, path);
        } else if (dir === '..') {
            if (path.length) {
                path.pop(); // remove from end
                cwd = restore_cwd(fs, path);
            }
        } else if (dir.match(/\//)) {
            var p = dir.replace(/\/$/, '').split('/').filter(Boolean);
            if (dir[0] !== '/') {
                p = path.concat(p);
            }
            cwd = restore_cwd(fs, p);
            path = p;
        } else if (!is_dir(cwd[dir])) {
            this.error($.terminal.escape_brackets(dir) + ' is not a directory');
        } else {
            cwd = cwd[dir];
            path.push(dir);
        }
        this.resume();
    },
    ls: function() {
        if (!is_dir(cwd)) {
            playAudio()
            throw new Error('Internal Error Invalid directory');
        }
        var dir = Object.keys(cwd).map(function(key) {
            if (is_dir(cwd[key])) {
                return key + '/';
            }
            return key;
        });
        this.echo(dir.join('\n'));
    },
    cat: function(file) {
        if (!is_file(cwd[file])) {
            this.error($.terminal.escape_brackets(file) + " don't exists");
        } else {
            this.echo(cwd[file]);
        }
    }
};

function playAudio() {
    console.log("playing audio")
    const audio_list = [
                        "assets/1772817.mp3",
                        "assets/2806608.mp3",
                        "assets/3322341.mp3",
                        "assets/5643712.mp3",
                        "assets/6796298.mp3"
                    ]
    var random_audio = audio_list[Math.floor(Math.random()*audio_list.length)];
    var audio = new Audio(random_audio);
    console.log("playing audio :: "+random_audio)
    audio.play();
}


function completion(string, callback) {
    var command = this.get_command();
    var cmd = $.terminal.parse_command(command);
    function dirs(cwd) {
        return Object.keys(cwd).filter(function(key) {
            return is_dir(cwd[key]);
        }).map(function(dir) {
            return dir + '/';
        });
    }
    if (cmd.name === 'ls') {
        callback([]);
    } else if (cmd.name === 'cd') {
        var p = string.split('/').filter(Boolean);
        if (p.length === 1) {
            if (string[0] === '/') {
                callback(dirs(fs));
            } else {
                callback(dirs(cwd));
            }
        } else {
            if (string[0] !== '/') {
                p = path.concat(p);
            }
            if (string[string.length - 1] !== '/') {
                p.pop();
            }
            var prefix = string.replace(/\/[^/]*$/, '');
            callback(dirs(restore_cwd(fs, p)).map(function(dir) {
                return prefix + '/' + dir;
            }));
        }
    } else if (cmd.name === 'cat') {
        var files = Object.keys(cwd).filter(function(key) {
            return is_file(cwd[key]);
        });
        callback(files);
    } else {
        callback(Object.keys(commands));
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$('body').terminal(commands,
    {
    completion: completion,
    name: 'Terminal Jarvis v0.1',
    prompt: prompt(),
    greetings: 'Terminal Jarvis v0.1 - :: Type \'help\' to show options\n'+ASCII_TEXT+showHelp(),
    exceptionHandler: exceptionHandlerFn()
    }
);

function showHelp() {
    return HELP;
}

function exceptionHandlerFn() {
    console.log("Something went wrong")
}

function saysomething(name) {
    speakText('Hieee ' +name+ '.Welcome from say something.')
    return 'Hieee ' +name+ '..Weocooooooooooooomeeeeeeeeeeeeeeeee from saysomething.';
}

async function fetchAdviceAPI() {
    let url = "https://api.adviceslip.com/advice";
    let response = await fetch(url);
    let data = await response.text();
    parsed_response = JSON.parse(data);
    return parsed_response.slip.advice
}

async function weatherAPI(city) {
    let api_key = "a96ddd921cbd4cc62683b3fa95c67cd2"
    let url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+api_key;
    let response = await fetch(url);
    let data = await response.text();
    parsed_response = JSON.parse(data);
    console.log(parsed_response);
    if (parsed_response.cod.toString() === '404') {
        return parsed_response.message;
    }
    let temp = (parsed_response.main.temp)-273.15;
    return "Weather in "+city+", "+parsed_response.sys.country+
    " is : "+parsed_response.weather[0].main+" : "+parsed_response.weather[0].description
    +" \nTemperture is "+temp.toString().substring(0, 4)+"°C"

}

async function phoneAPI(phone_no) {
    console.log(phone_no);
    console.log(phone_no.toString());
    console.log(phone_no.length);
    let api_key = "3be95701c94b46ec802a1f16b74818a8"
    let url = "https://phonevalidation.abstractapi.com/v1/?api_key="+api_key+"&phone="+phone_no;
    let response = await fetch(url);
    console.log(response)
    let data = await response.text();
    console.log(data);
    parsed_response = JSON.parse(data);
    console.log(parsed_response);
    if (parsed_response.valid) {
        let carrier = parsed_response.carrier;
        let location = parsed_response.location;
        let type =  parsed_response.type;
        return carrier +"\n"+location+"\n"+type;
    }
    if (phone_no.toString().length === 10 ) {
        return "Please provide country code. eg +918135728754"
    }
    if (phone_no.length < 10) {
       return "Invalid phone number. (Phone number less than 10 digit)";
    }
    return "Invalid phone number"    
}

async function foaas() {
    const url_array = ['zero', 'asshole', 'awesome', 'bag', 'bucket', 'bye', 'cool', 'cup', 'dense', 'diabetes', 'dumbledore', 'even', 'everyone', 'everything', 'everything', 'family', 'fascinating', 'flying', 'ftfy', 'fyyff', 'give', 'holygrail', 'horse', 'idea', 'immensity', 'jinglebells', 'life', 'logs', 'looking', 'lowpoly', 'maybe', 'me', 'mornin', 'no', 'pink', 'question', 'ratsarse', 'retard', 'ridiculous', 'rtfm', 'sake', 'shit', 'single', 'thanks', 'that', 'this', 'too', 'tucker', 'what', 'yeah', 'zayn', ''];
    var random_url = url_array[Math.floor(Math.random()*url_array.length)];
    url = "https://foaas.com/"+random_url+"/terminalUI";
    let response = await fetch(url, { headers: new Headers({'Accept': 'application/json'})});
    let data = await response.text();
    console.log(data)
    parsed_response = JSON.parse(data);
    console.log(response)
    speakText(parsed_response.message)
    return parsed_response.message
}

async function whatsmyIP() {
    let url = "https://jsonip.com";
    let response = await fetch('https://jsonip.com', { mode: 'cors' });
    let data = await response.text();
    parsed_response = JSON.parse(data);
    let ip =  parsed_response.ip;
    const url_ip_details = "http://ip-api.com/json/"+ip.toString();
    let response2 = await fetch(url_ip_details, { mode: 'cors' });
    let data2 = await response2.text();
    parsed_response2 = JSON.parse(data2);
    console.log(parsed_response2);
    if (parsed_response2.status === 'success') {
        let country = parsed_response2.country;
        let city = parsed_response2.city;
        let isp =  parsed_response2.isp;
        let regionName =  parsed_response2.regionName;
        return parsed_response.ip +"\n\n"+country+"\n"+city+"\n"+isp+"\n"+regionName;
    }
    return parsed_response.ip;
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    // for Internet Explorer 8 and below. For Blogger, you should use &amp;&amp; instead of &&.
    } else if (document.selection && document.selection.type != "Control") { 
        text = document.selection.createRange().text;
    }
    return text;
}



$(document).ready(function (){ // when the document has completed loading
   $(document).mouseup(function (e){ // attach the mouseup event for all div and pre tags
      setTimeout(function() { // When clicking on a highlighted area, the value stays highlighted until after the mouseup event, and would therefore stil be captured by getSelection. This micro-timeout solves the issue. 
         responsiveVoice.cancel(); // stop anything currently being spoken
         responsiveVoice.speak(getSelectionText()); //speak the text as returned by getSelectionText
      }, 1);
   });
});

function speakText(text) {
    responsiveVoice.speak(text);
    return "";
}


async function gender(name) {
    let url = "https://api.genderize.io/?name="+name;
    let response = await fetch(url);
    let data = await response.text();
    parsed_response = JSON.parse(data);  
    let gender_name = parsed_response.name;
    let gender_id = parsed_response.gender;
    let probability = parsed_response.probability;
    if(gender_id === null) {
        return "We dont have any record for this name"
    }
    return gender_name +" is a "+gender_id+" name with "+probability*100+"% probaility";   
}

function prompt() {
    return function(callback) {
        var prompt;
        prompt = 'user@host:~' + path.join('/') + '$ ';
        $('.title').html(prompt);
        callback(prompt);
    };
}
