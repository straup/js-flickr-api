/*

info.aaronland.flickr.API library v1.01
Copyright (c) 2009 Aaron Straup Cope

This is free software. You may redistribute it and/or modify it under
the same terms as Perl Artistic License.

http://en.wikipedia.org/wiki/Artistic_License

*/

if (! info){
    var info = {};
}

if (! info.aaronland){
    info.aaronland = {};
}

if (! info.aaronland.flickr){
    info.aaronland.flickr = {};
}

info.aaronland.flickr.API = function(args){

    this.args = args;

    this._host = 'api.flickr.com';
    this._endpoint = '/services/rest';

    this.canhas_console = (typeof(console) == 'object') ? 1 : 0;
}

info.aaronland.flickr.API.prototype.api_call = function(method, args){

    this.log('calling: ' + method);

    args['noCacheIE'] = (new Date()).getTime();
    var url = this.api_call_url(method, args);

    var skip_ie_cachebuster=1;
    this.json_request(url, skip_ie_cachebuster);
};

info.aaronland.flickr.API.prototype.api_call_url = function(method, args){

    args['api_key'] = this.args['key'];
    args['method'] = method;
    args['format'] = 'json';
    args['nojsoncallback'] = 1;

    // Imagine a world where the signature is pre-generated
    // server-side and passed to the JS by a templating system

    if ((args['auth_token']) && (! args['api_sig'])){
    	var sig = this.sign_args(args);
    	args['api_sig'] = sig;
    }

    var params = new Array();

    for (prop in args){
        var str = prop + '=' + encodeURIComponent(args[prop]);
        params.push(str);
    }

    var url = 'http://' + this._host + this._endpoint;
    url += '?';
    url += params.join("&");
    
    this.log('request: ' + url)
    return url;
};

info.aaronland.flickr.API.prototype.sign_args = function(args){

    var keys = new Array();
    var str = '';

    for (prop in args){
        keys.push(prop);
    }

    keys.sort();

    for (i in keys){
        var prop = keys[i];
        str += prop + args[prop];
    }
    
    this.log('signing: ********' + str);

    return hex_md5(this.args['secret'] + str);
};

info.aaronland.flickr.API.prototype.json_request = function(url, skip_ie_cachebuster){
                    
    jsr = new JSONscriptRequest(url); 

    if (skip_ie_cachebuster){
       jsr.noCacheIE = '';
    }

    jsr.buildScriptTag(); 
    jsr.addScriptTag();
};

info.aaronland.flickr.API.prototype.log = function(msg){

    if (! this.args['enable_logging']){
        return;
    }

    // sudo make me work with (not firebug)

    if (! this.canhas_console){
        return;
    }

    console.log('[flickr] ' + msg);
};

// -*-java-*-