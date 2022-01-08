import inquirer from 'inquirer';
import colors from 'colors/safe';
import config from '../../config';

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${colors.green('1.')} Cambiar Wallet`
            },
            {
                value: 2,
                name: `${colors.green('2.')} Ver Balance`
            },
            {
                value: 3,
                name: `${colors.green('3.')} Ver precio actual Luna-Bluna`
            },
            {
                value: 4,
                name: `${colors.green('4.')} Configurar parametros de Auto-Swap`
            },
            {
                value: 5,
                name: `${colors.green('5.')} Comenzar Auto-Swap`
            },
            {
                value: 0,
                name: `${colors.green('0.')} Salir`
            },
        ]
    }
];


const inquirerMenu = async() => {
    console.clear()
    console.log(colors.yellow('Bienvenido al Bot de Swap Luna-Bluna'));
    console.log('Actualmente estas usando la wallet con el siguiente address: ');
    console.log(colors.cyan(config.wallet.address));
    console.log(colors.green('==========================='));
    console.log(colors.white('    Selecciona una opción'));
    console.log(colors.green('==========================='));

    const {opcion} = await inquirer.prompt(preguntas);
    return opcion;

}

const pausa = async() => {
    console.log('\n')
    await inquirer.prompt([
        {
            type: 'input',
            name: 'enter',
            message: `\nPresione ${colors.green('ENTER')} para continuar\n`,
        }
    ]);
}

const leerInput = async( message: string ) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value: string ) {
                if ( value.length === 0) {
                    return 'Por favor ingresa un valor';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const confirmar = async( message:string ) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }  
    ];
    const {ok} = await inquirer.prompt(question);
    return ok;
}

export {
    inquirerMenu,
    pausa,
    leerInput,
    confirmar,
}