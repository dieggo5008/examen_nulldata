import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public usuario: any = {};
	public usuarios: any = [];
	public emailPattern: any = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/;
	public location = {
		direcccion: 'Paseo de la Reforma 199, Cuauhtémoc, Ciudad de México',
		lat: 0,
		lng: 0
	};
	public isUpdate = false;
	public index = 0;
	public show = false;
	public msg = '';

  	constructor(private http: Http) { }

  	ngOnInit() {
  		let users = localStorage.getItem('usuarios');
  		if(users)
  			this.usuarios = JSON.parse(users);

  		this.getlatlng('Paseo de la Reforma 199, Cuauhtémoc, Ciudad de México')
  			.subscribe((data) => {
  				if(data){
  					this.location.lat = data.geometry.location.lat;
  					this.location.lng = data.geometry.location.lng;
  				}
  			}, (error) => {
  				console.error(error);
  			});
  	}

  	nuevoUsuario(){
  		this.usuario = {};
  		this.isUpdate = false;

  		$('form')[0].reset();
  	}

  	guardarUsuario(){
  		this.usuarios.push(Object.assign({}, this.usuario));
		localStorage.setItem('usuarios', JSON.stringify(this.usuarios));

  		this.usuario = {};
		$('form')[0].reset();
		this.showAlert('Usuario guardado correctamente.');
  	}

  	actualizarUsuario(){
  		this.usuarios[this.index] = this.usuario;
  		localStorage.setItem('usuarios', JSON.stringify(this.usuarios));

  		this.usuario = {};
  		this.isUpdate = false;
  		$('form')[0].reset();
  		this.showAlert('Usuario actualizado correctamente.');
  	}

  	eliminarUsuario(index){
  		if(confirm('¿Estas seguro de eliminar al usuario?')){
	  		this.usuarios.splice(index, 1);
	  		localStorage.setItem('usuarios', JSON.stringify(this.usuarios));

	  		this.usuario = {};
	  		this.isUpdate = false;
	  		$('form')[0].reset();
	  		this.showAlert('Usuario eliminado correctamente.');
  		}
  	}

  	direccionUsuario(usuario, index){
  		this.index = index;
  		this.usuario = usuario;
  		this.isUpdate = true;

  		let direccion = this.usuario.calle + ', ' + this.usuario.municipio + ', ' + this.usuario.estado;
  		this.location.direcccion = direccion;

  		this.getlatlng(direccion)
  			.subscribe((data) => {
  				if(data){
  					this.location.lat = data.geometry.location.lat;
  					this.location.lng = data.geometry.location.lng;
  				}else {
  					alert('No se ha podido hacer conexión con Google Maps, favor de intentar de nuevo.');
  				}
  			}, (error) => {
  				console.error(error);
  			});
  	}


  	getlatlng(address){
  		return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
			.map((data) => {
  				return data.json().results[0];
  			})
  			.catch(this.handlerErrors);
	}

	showAlert(msg) {
		this.msg = msg;
		this.show = true;
		setTimeout(() => {
			this.show = false;
		}, 3000);
	}

	handlerErrors(error){
		console.error(error);
  		return Observable.throw(error);
	}

}
