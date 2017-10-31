'use strict';

// structure

class Model {

    constructor(data) {
        let data_array = data;

        for(let key in data_array) {
            if(typeof this[key] === "function" ) {
                    this[key] = this[key](data_array[key]);
            } else {
                this[key] = data_array[key];
            }
        }
    }

    static factory(data){
        return Factory(data, this);
    }

    hasMany(data, model) {
        return Factory(data, model);
    }

    hasOne(data, model) {
        return new model(data);
    }
}

function Factory(data, model) {
    let list = [];

    for(let one of data) {
        list.push(new model(one));
    }

    return list;
}



// custom code
moment.locale('ru');

class CustomModel extends Model {
    get created(){
        return moment(this.created_at);
    }

    get updated(){
        return moment(this.updated_at);
    }

}


class Area extends CustomModel {
    flag(data) {
        return super.hasOne(data, Image);
    }

    image(data) {
        return super.hasOne(data, Image);
    }

    lower(data) {
        return super.hasMany(data, Area);
    }

    get geoLink(){
        return link;
    }
}

class Image extends CustomModel {
    files(data) {
        return super.hasMany(data, File);
    }

    get sizes() {
        let sizes = [];
        for(let file in this.files) {
            sizes.push(this.files[file].width + 'x' + this.files[file].height);
        }

        return sizes;
    }

    get original() {
        return this.files[this.files.length-1];
    }

    getFirstBelow(val, dimension) {
        for (let i = this.files.length - 1; i >= 0; i--) {
            if(this.files[i][dimension] < val) return this.files[i];
        }
    }

    getFirstAbove(val, dimension) {
        for (let i = 0; i < this.files.length; i++) {
            if(this.files[i][dimension] > val) return this.files[i];
        }
    }
}

class File extends Model {
    get full_path() {
        // TODO: replace by domain name from config
        return window.location.origin + this.path;
    }
}
