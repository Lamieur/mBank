// aby sesja nie wygasała z powodu bezczynności
// może kiedyś zautomatyzuję, ale wystarczy w konsoli js wklikać:
setInterval(function(){Ebre.SessionCounter.trigger('keepAlive');}, 300000)
