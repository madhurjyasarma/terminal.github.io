const ASCII_TEXT = 
"████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗         ██╗   ██╗██╗\n"+
"╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║         ██║   ██║██║\n"+
"   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║         ██║   ██║██║\n"+
"   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║         ██║   ██║██║\n"+
"   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗    ╚██████╔╝██║\n"+
"   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝     ╚═════╝ ╚═╝\n";                                                                           

$('body').terminal(
{
    iam: function (name) {
        this.echo('Hello, ' + name +
            '. Welcome to TERMINAL UI.');
    },
    developer: function () {
        this.echo('MVDZO X AVIN');
    },
    help: function () {
        this.echo(
          'help                             :: to show this menu\n'
        +'iam <your name>                  :: for greeting\n'
        +'developer                        :: to know the Anonymous\n'
        +'advice                            :: to get a free advice\n'
        +"weather <city name>               :: check your city's weather\n"
        +"phone <country code><phone number>:: to get details of your number\n");
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
    }
},
{
    greetings: 'Terminal UI - Hack TTS NASA :: Type \'help\' to show options\n'+ASCII_TEXT+speakText("Welcome to Terminal U.I")
});

function saysomething(name) {
    speakText('Hieee ' +name+ '.Welocoome from say something.')
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
    console.log(response)
    let data = await response.text();
    console.log(data);
    parsed_response = JSON.parse(data);
    console.log(parsed_response);
    console.log(parsed_response.weather[0])
    console.log(parsed_response.weather[0].main)
    return "Weather in "+city+" is : "+parsed_response.weather[0].main+" :: "+parsed_response.weather[0].description

}

async function phoneAPI(phone_no) {
    console.log(phone_no);
    console.log(phone_no.toString());
    console.log(phone_no.length);
    let api_key = "3be95701c94b46ec802a1f16b74818a8"
    let url = "https://phonevalidation.abstractapi.com/v1/?api_key=3be95701c94b46ec802a1f16b74818a8&phone="+phone_no;
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
    url = "https://foaas.com/"+random_url+"/sharma";
    let response = await fetch(url, { headers: new Headers({'Accept': 'application/json'})});
    let data = await response.text();
    console.log(data)
    parsed_response = JSON.parse(data);
    console.log(response)
    speakText(parsed_response.message)
    return parsed_response.message
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

