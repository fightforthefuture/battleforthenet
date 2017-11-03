#!/usr/bin/env node
'use strict';

/**
 *  ----------------------------------------------------------------------------
 *  Generates a Free Progress domain security token!
 *  ----------------------------------------------------------------------------
 *  This is a build script that generates a token to whitelist this site for
 *  Free Progress. It generates a file freeprogress.txt based like so:
 *
 *  freeprogress.txt = SHA256( [FP_DOMAIN_SECURITY_TOKEN] + [CNAME] )
 *
 *  Where FP_DOMAIN_SECURITY_TOKEN is stored in Free Progress environment vars
 *        CNAME is the contents of the CNAME file in the root
 *
 */

const fs = require('fs');
const hash = require('crypto').createHash('sha256');
const token = process.env.FP_DOMAIN_SECURITY_TOKEN;

if (!token) {
  console.log('FP_DOMAIN_SECURITY_TOKEN environment variable is not set.');
  process.exit(0);
}

fs.readFile('CNAME', 'utf8', (err, data) => {
  if (err) {
    console.log('No CNAME for this project. Nothing to do here.');
    process.exit(0);
  }

  const cname = data.trim().toLowerCase();
  const fpKey = hash.update(token + cname, 'utf8').digest('hex');
  const fpPath = 'freeprogress.txt';

  fs.writeFile(fpPath, fpKey, err => {
    console.log('Wrote Free Progress domain security token to freeprogress.txt');
  });
});
