async function f1() {
    return 'test async';
}

f1().then(console.log);

class WithStatic {
    static id = 5;
}

console.log(WithStatic.id);