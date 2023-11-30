exports.convertFileSize = function(sizeInBytes) {
  const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;
    const TB = GB * 1024;

    if (sizeInBytes < KB) {
        return sizeInBytes + ' B';
    } else if (sizeInBytes < MB/2) {
        return (sizeInBytes / KB).toFixed(2) + ' KB';
    } else if (sizeInBytes < GB/2) {
        return (sizeInBytes / MB).toFixed(2) + ' MB';
    } else if (sizeInBytes < TB/2) {
        return (sizeInBytes / GB).toFixed(2) + ' GB';
    } else {
        return (sizeInBytes / TB).toFixed(2) + ' TB';
    }
}

exports.headerStream = function(ext) {
    if(ext == '.jpg' || ext == '.jpeg') {
        return 'image/jpeg';
    } else if(ext == '.png') {
        return 'image/png';
    } else if(ext == '.gif') {
        return 'image/gif';
    } else if(ext == '.pdf') {
        return 'application/pdf';
    } else {
        return false;
    }
}