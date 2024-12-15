import { Component, OnInit } from '@angular/core';
import { ProfesoresService } from '../../services/profesores.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AlumnosService } from '../../services/alumnos.service';
import { MateriasService } from '../../services/materias.service';
import { environment } from '../../../environments/environments';
import { Iprofesor } from '../../interfaces/iprofesor';
import { Iusuario } from '../../interfaces/iusuario';

@Component({
  selector: 'app-panel-administrador',
  standalone: true,
  templateUrl: './panel-administrador.component.html',
  styleUrls: ['./panel-administrador.component.css'],
})
export class PanelAdministradorComponent implements OnInit {
  profesores: Iprofesor[] = [];
  profesoresFiltrados: Iprofesor[] = [];
  alumnos: Iusuario[] = [];
  alumnosFiltrados: Iusuario[] = [];
  respuestaAPI: string = '';
  materiasPorProfesor: { [profesorId: number]: string[] } = {};
  seccionActual: 'profesores' | 'alumnos' = 'profesores';
  fotoSeleccionada: string | null = null;
  mostrarModalFoto: boolean = false;

  profesoresPaginados: Iprofesor[] = [];
  alumnosPaginados: Iusuario[] = [];
  paginaActual: number = 1;
  registrosPorPagina: number = 5;
  totalPaginas: number = 1;

  constructor(
    private profesoresService: ProfesoresService,
    private usuariosService: UsuariosService,
    private alumnosService: AlumnosService,
    private materiasService: MateriasService
  ) {}

   //Inicializa el estado del componente y carga los datos
  ngOnInit(): void {
    this.cargarProfesores();
    this.cargarAlumnos();
  }
   // Actualiza la paginación en función de la sección y los filtros actuales
  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
  
    if (this.seccionActual === 'profesores') {
      this.totalPaginas = Math.ceil(this.profesoresFiltrados.length / this.registrosPorPagina);
      this.profesoresPaginados = this.profesoresFiltrados.slice(inicio, fin);
    } else if (this.seccionActual === 'alumnos') {
      this.totalPaginas = Math.ceil(this.alumnosFiltrados.length / this.registrosPorPagina);
      this.alumnosPaginados = this.alumnosFiltrados.slice(inicio, fin);
    }
  }
   // Cambia la página para la paginación
  cambiarPagina(direccion: number): void {
    this.paginaActual += direccion;
    this.actualizarPaginacion();
  }
// Carga y transforma los datos de los profesores desde la API
  async cargarProfesores() {
    try {
      const profesores = await this.profesoresService.listarProfesores();
      this.profesores = profesores.map((profesor) => {
        const profesorConvertido: Iprofesor = {
          ...profesor,
          validado: Boolean(profesor.validado),
          activo: Boolean(profesor.activo),
        };
  
        if (profesorConvertido.localizacion) {
          try {
            const localizacionObj = JSON.parse(profesorConvertido.localizacion);
            profesorConvertido.localizacion =
              localizacionObj.address.split(',')[0];
          } catch {
            profesorConvertido.localizacion = profesorConvertido.localizacion;
          }
        } else {
          profesorConvertido.localizacion = 'No disponible';
        }
  
        if (
          profesorConvertido.foto &&
          profesorConvertido.foto.startsWith('/img/profiles/')
        ) {
          profesorConvertido.foto = `${environment.API_URL}${profesorConvertido.foto}`;
        } else {
          profesorConvertido.foto = undefined;
        }
  
        return profesorConvertido;
      });
  
      this.profesoresFiltrados = [...this.profesores]; 
      for (const profesor of this.profesores) {
        try {
          if (profesor.id !== undefined) {
            const materias = await this.materiasService.obtenerMateriasProfesor(
              profesor.id
            );
            this.materiasPorProfesor[profesor.id] = materias.map(
              (m) => m.nombre
            );
          }
        } catch {
          if (profesor.id !== undefined) {
            this.materiasPorProfesor[profesor.id] = [];
          }
        }
      }
  
      this.actualizarPaginacion(); 
    } catch (error) {
      console.error('Error al cargar profesores:', error);
    }
  }  
 // Carga y transforma los datos de los alumnos desde la API
  async cargarAlumnos() {
    try {
      const alumnos = await this.alumnosService.listarAlumnos();
      this.alumnos = alumnos.map((alumno) => {
        const alumnoConvertido: Iusuario = {
          ...alumno,
          activo: Boolean(alumno.activo),
        };
  
        if (
          alumnoConvertido.foto &&
          alumnoConvertido.foto.startsWith('/img/profiles/')
        ) {
          alumnoConvertido.foto = `${environment.API_URL}${alumnoConvertido.foto}`;
        } else {
          alumnoConvertido.foto = undefined;
        }
  
        return alumnoConvertido;
      });
  
      this.alumnosFiltrados = [...this.alumnos]; 
      this.actualizarPaginacion(); 
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
    }
  }  
// Abre una foto en el modal para mostrarla
  abrirFoto(foto: string) {
    if (
      foto.startsWith(`${environment.API_URL}/img/profiles/`) ||
      foto.startsWith('/img/profiles/')
    ) {
      this.fotoSeleccionada = foto.startsWith('http')
        ? foto
        : `${environment.API_URL}${foto}`;
      this.mostrarModalFoto = true;
    } else {
      console.warn('Foto no válida o de prueba');
    }
  }
// Cierra el modal de visualización de fotos
  cerrarModalFoto() {
    this.fotoSeleccionada = null;
    this.mostrarModalFoto = false;
  }
// Cambia el estado activo/inactivo de un usuario
  async cambiarEstadoUsuario(id: number, activo: boolean) {
    try {
      const response = await this.usuariosService.activarUsuario(id, activo);
      this.respuestaAPI = response.message;
      setTimeout(() => {
        this.respuestaAPI = '';
      }, 3000);
      this.cargarProfesores();
      this.cargarAlumnos();
    } catch {}
  }
// Cambia el estado de validación de un profesor
  async cambiarValidacionProfesor(id: number, validado: boolean) {
    try {
      const response = await this.profesoresService.validarProfesor(
        id,
        validado
      );
      this.respuestaAPI = response.message;
      setTimeout(() => {
        this.respuestaAPI = '';
      }, 3000);
      this.cargarProfesores();
    } catch {}
  }
 // Cambia la sección visible entre profesores y alumnos
  cambiarSeccion(seccion: 'profesores' | 'alumnos') {
    this.seccionActual = seccion;
    this.respuestaAPI = '';
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }
// Limpia el mensaje de respuesta de la API
  limpiarMensajeAPI() {
    this.respuestaAPI = '';
  }
 // Filtra la lista de profesores en función del filtro seleccionado
  filtrarProfesores(event: Event) {
    const filtro = (event.target as HTMLSelectElement).value;

    let filtrados = this.profesores;

    if (filtro === 'validados') {
      filtrados = filtrados.filter((profesor) => profesor.validado === true);
    } else if (filtro === 'noValidados') {
      filtrados = filtrados.filter((profesor) => profesor.validado === false);
    } else if (filtro === 'activos') {
      filtrados = filtrados.filter((profesor) => profesor.activo === true);
    } else if (filtro === 'noActivos') {
      filtrados = filtrados.filter((profesor) => profesor.activo === false);
    }

    const query =
      (
        document.getElementById('buscarProfesor') as HTMLInputElement
      )?.value.toLowerCase() || '';
    this.profesoresFiltrados = filtrados.filter((profesor) =>
      profesor.email.toLowerCase().includes(query)
    );
    this.actualizarPaginacion();
  }
// Filtra la lista de alumnos en función del filtro seleccionado
  filtrarAlumnos(event: Event) {
    const filtro = (event.target as HTMLSelectElement).value;

    let filtrados = this.alumnos;

    if (filtro === 'activos') {
      filtrados = filtrados.filter((alumno) => alumno.activo === true);
    } else if (filtro === 'noActivos') {
      filtrados = filtrados.filter((alumno) => alumno.activo === false);
    }

    const query =
      (
        document.getElementById('buscarAlumno') as HTMLInputElement
      )?.value.toLowerCase() || '';
    this.alumnosFiltrados = filtrados.filter((alumno) =>
      alumno.email.toLowerCase().includes(query)
    );

    this.actualizarPaginacion();
  }
// Busca profesores en la lista según el texto introducido
  buscarProfesor(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.profesoresFiltrados = this.profesores.filter((profesor) =>
      profesor.email.toLowerCase().includes(query)
    );
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }
// Busca alumnos en la lista según el texto introducido
  buscarAlumno(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.alumnosFiltrados = this.alumnos.filter((alumno) =>
      alumno.email.toLowerCase().includes(query)
    );
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }
}
