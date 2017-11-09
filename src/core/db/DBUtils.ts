import {Injectable} from "@angular/core";
import {SQLite} from "ionic-native";
/**
 *
 * 数据类型对应字符，请查看 http://www.runoob.com/sqlite/sqlite-data-types.html
 *
 * Created by zxh on 2017/1/16.
 */
//SQLit工具类
@Injectable()
export class DBUtils {

    private dbName = 'scho.mschool.db';//数据库名
    private db;
    private database;

    constructor() {
        try {
            this.db = new SQLite();
        } catch (e) {
            console.log(e);
        }
    }

    getDB() {
        try {
            if (this.database) {
                return this.database;
            }
            if (!this.db) {
                console.log('this.db is undefined');
                this.db = new SQLite();
            }
            return this.database = this.db.openDatabase({
                name: this.dbName,
                location: 'default'
            });
        } catch (e) {
            console.log(e);
        }
    }

    closeDB() {
        try {
            if (!this.db) {
                console.log('this.db is undefined');
                this.db = new SQLite();
            }
            this.db.close();
        } catch (e) {
            console.log(e);
        }
    }

    //创建表
    createTable(TableInfo: {tableName: string, columns: [{column: string, dataType: string}], success?: any, error?: any}) {
        try {
            if (TableInfo.tableName && TableInfo.tableName == '') {
                console.log('表名不能为空');
            }
            this.getDB().then(() => {
                let sql = 'CREATE TABLE IF NOT EXISTS ' + TableInfo.tableName + '(';
                for (let i = 0; i < TableInfo.columns.length; i++) {
                    sql += TableInfo.columns[i].column + ' ' + TableInfo.columns[i].dataType;
                    if (i != TableInfo.columns.length - 1) {
                        sql += ',';
                    }
                }
                sql += ');';
                this.db.executeSql(sql, {}).then(() => {
                    if (TableInfo.success) {
                        TableInfo.success();
                    }
                }, (err) => {
                    if (TableInfo.error) {
                        TableInfo.error(err);
                    }
                    console.log('SQL batch ERROR: ' + err.message);
                });
            });
        } catch (e) {
            console.log(e);
        }
    }

    //判断表是否存在
    tabIsExist(tableName: string) {
        return this.getDB().then(() => {
            let sql = 'SELECT COUNT(*) as count FROM sqlite_master where type="table" and name="' + tableName + '";';
            return this.db.executeSql(sql, {}).then((data) => {
                if (data.rows.item(0).count > 0) {
                    return true;
                } else {
                    return false;
                }
            }, (err) => {
                console.log('SQL batch ERROR: ' + err.message);
                return false;
            });
        });
    }

    //查询表中所有数据
    selectAll(obj: {tableName: string, success?: any, error?: any}) {
        try {
            this.tabIsExist(obj.tableName).then((isExist) => {
                if (isExist == true) {
                    this.getDB().then(() => {
                        this.db.executeSql('SELECT * FROM ' + obj.tableName, {}).then((data) => {
                            if (obj.success) {
                                let result = [];
                                for (let i = 0; data.rows.item(i); i++) {
                                    result[i] = data.rows.item(i)
                                }
                                obj.success(result);
                            }
                        }, (err) => {
                            console.log('SQL batch ERROR: ' + err.message);
                            if (obj.error) {
                                obj.error(err);
                            }
                        });
                    });
                } else {
                    if (obj.error) {
                        obj.error({message: obj.tableName + ' tab no create'});
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    //根据条件查询
    selectByWhere(obj: {tableName: string, where: string, success?: any, error?: any}) {
        try {
            this.tabIsExist(obj.tableName).then((isExist) => {
                if (isExist == true) {
                    this.getDB().then(() => {
                        let sql = 'SELECT * FROM ' + obj.tableName + ' WHERE ' + obj.where + ';';
                        this.db.executeSql(sql, {}).then((data) => {
                            if (obj.success) {
                                let result = [];
                                for (let i = 0; data.rows.item(i); i++) {
                                    result[i] = data.rows.item(i)
                                }
                                obj.success(result);
                            }
                        }, (err) => {
                            console.log('SQL batch ERROR: ' + err.message);
                            if (obj.error) {
                                obj.error(err);
                            }
                        });
                    });
                } else {
                    if (obj.error) {
                        obj.error({message: obj.tableName + ' tab no create'});
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    //插入一条数据
    insert(obj: {tableName: string, data: any, success?: any, error?: any}) {
        try {
            this.tabIsExist(obj.tableName).then((isExist) => {
                if (isExist == true) {
                    this.getDB().then(() => {
                        let sql = 'INSERT INTO ' + obj.tableName + ' VALUES (';
                        for (let item in obj.data) {
                            if (this.objIsString(obj.data[item]) == true) {
                                sql += ('"' + obj.data[item].replace(new RegExp('"', 'g'), '""') + '",');
                            } else {
                                sql += (obj.data[item] + ',');
                            }
                        }
                        sql = sql.slice(0, sql.length - 1) + ');';
                        this.db.executeSql(sql, {}).then(() => {
                            if (obj.success) {
                                obj.success();
                            }
                        }, (err) => {
                            console.log('SQL batch ERROR: ' + err.message);
                            if (obj.error) {
                                obj.error(err);
                            }
                        });
                    });
                } else {
                    if (obj.error) {
                        obj.error({message: obj.tableName + ' tab no create'});
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    //插入多条数据
    insertAll(obj: {tableName: string, datas: any, success?: any, error?: any}) {
        try {
            this.tabIsExist(obj.tableName).then((isExist) => {
                if (isExist == true) {
                    this.getDB().then(() => {
                        let sql = 'INSERT INTO ' + obj.tableName + ' VALUES (';
                        for (let i = 0; i < obj.datas.length; i++) {
                            for (let item in obj.datas[i]) {
                                if (this.objIsString(obj.datas[i][item]) == true) {
                                    sql += ('"' + obj.datas[i][item].replace(new RegExp('"', 'g'), '""') + '",');
                                } else {
                                    sql += (obj.datas[i][item] + ',');
                                }
                            }
                            sql = sql.slice(0, sql.length - 1) + '),(';
                        }
                        sql = sql.slice(0, sql.length - 2) + ';';
                        this.db.executeSql(sql, {}).then(() => {
                            if (obj.success) {
                                obj.success();
                            }
                        }, (err) => {
                            console.log('SQL batch ERROR: ' + err.message);
                            if (obj.error) {
                                obj.error(err);
                            }
                        });
                    });
                } else {
                    if (obj.error) {
                        obj.error({message: obj.tableName + ' tab no create'});
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    //删除数据
    delete(obj: {tableName: string, where: string, success?: any, error?: any}) {
        try {
            this.tabIsExist(obj.tableName).then((isExist) => {
                if (isExist == true) {
                    this.getDB().then(() => {
                        let sql = 'DELETE FROM ' + obj.tableName + ' WHERE ' + obj.where + ';';
                        this.db.executeSql(sql, {}).then(() => {
                            if (obj.success) {
                                obj.success();
                            }
                        }, (err) => {
                            console.log('SQL batch ERROR: ' + err.message);
                            if (obj.error) {
                                obj.error(err);
                            }
                        });
                    });
                } else {
                    if (obj.error) {
                        obj.error({message: obj.tableName + ' tab no create'});
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    //删除表中所有数据
    deleteAll(obj: {tableName: string, success?: any, error?: any}) {
        try {
            this.tabIsExist(obj.tableName).then((isExist) => {
                if (isExist == true) {
                    this.getDB().then(() => {
                        let sql = 'DELETE FROM ' + obj.tableName + ';';
                        this.db.executeSql(sql, {}).then(() => {
                            if (obj.success) {
                                obj.success();
                            }
                        }, (err) => {
                            console.log('SQL batch ERROR: ' + err.message);
                            if (obj.error) {
                                obj.error(err);
                            }
                        });
                    });
                } else {
                    if (obj.error) {
                        obj.error({message: obj.tableName + ' tab no create'});
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    //删除表
    deleteTab(obj: {tableName: string, success?: any, error?: any}) {
        try {
            this.tabIsExist(obj.tableName).then((isExist) => {
                if (isExist == true) {
                    this.getDB().then(() => {
                        let sql = 'DROP TABLE ' + obj.tableName + ';';
                        this.db.executeSql(sql, {}).then(() => {
                            if (obj.success) {
                                obj.success();
                            }
                        }, (err) => {
                            console.log('SQL batch ERROR: ' + err.message);
                            if (obj.error) {
                                obj.error(err);
                            }
                        });
                    });
                } else {
                    if (obj.error) {
                        obj.error({message: obj.tableName + ' table does not exist'});
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    //更新数据
    update(obj: {tableName: string, data: any, where: string, success?: any, error?: any}) {
        try {
            this.tabIsExist(obj.tableName).then((isExist) => {
                if (isExist == true) {
                    this.getDB().then(() => {
                        let sql = 'UPDATE ' + obj.tableName + ' SET ';
                        for (let columnName in obj.data) {
                            if (this.objIsString(obj.data[columnName]) == true) {
                                sql = sql + columnName + '="' + obj.data[columnName].replace(new RegExp('"', 'g'), '""') + '",';
                            } else {
                                sql = sql + columnName + '=' + obj.data[columnName] + ',';
                            }
                        }
                        sql = sql.slice(0, sql.length - 1) + ' WHERE ' + obj.where;
                        this.db.executeSql(sql, {}).then(() => {
                            if (obj.success) {
                                obj.success();
                            }
                        }, (err) => {
                            console.log('SQL batch ERROR: ' + err.message);
                            if (obj.error) {
                                obj.error(err);
                            }
                        });
                    });
                } else {
                    if (obj.error) {
                        obj.error({message: obj.tableName + ' tab no create'});
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    //判断是否为字符串
    objIsString(obj: any) {
        if (Object.prototype.toString.call(obj) == '[object String]') {
            return true;
        } else {
            return false;
        }
    }
}
