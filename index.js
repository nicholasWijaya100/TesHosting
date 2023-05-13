/**
 * ctrl+c untuk stop running server
 *
 * npx nodemon index.js
 */

/**
 * 
query:
get /buku?buku_id=7&nama_buku=testing

params:
get /buku/7/nama/testing

body:
POST /login	
 */

const express = require("express");
const app = express();
const port = 3000;
const contohRouter = require("./src/routes/contoh");
const bukuRouter = require("./src/routes/buku");
const bukuRawRouter = require("./src/routes/bukuRaw");
const bukuORMRouter = require("./src/routes/bukuORM");
const contohRelasiRouter = require("./src/routes/contohRelasi");
const databaseBuku = require("./src/databases/connectionBuku");
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", contohRouter);
app.use("/api/v1/buku", bukuRouter);
app.use("/api/v1/bukuRaw", bukuRawRouter);
app.use("/api/v1/bukuORM", bukuORMRouter);
app.use("/api/v1/contohRelasi", contohRelasiRouter);

const initApp = async () => {
  console.log("Mencoba konek");
  try {
    await databaseBuku.authenticate();
    console.log("Berhasil konek");
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  } catch (error) {
    console.error("Gagal konek", error);
  }
};

initApp();
