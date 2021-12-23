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
    }
},
{
    greetings: 'Terminal UI - Hack NOSA :: Type \'help\' to show options\n'+ASCII_TEXT
});

function saysomething(name) {
    return 'Hieee ' +name+ '..Weocooooooooooooomeeeeeeeeeeeeeeeee from saysomething.';
}

async function fetchAdviceAPI() {
    let url = "https://api.adviceslip.com/advice";
    let response = await fetch(url);
    // console.log(response)
    let data = await response.text();
    // console.log(data);
    parsed_response = JSON.parse(data);
    // console.log(parsed_response);
    // console.log(parsed_response.slip.advice);
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

function showMatrix() {
    
}
