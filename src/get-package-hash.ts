import crypto from 'crypto';
import fs from 'fs';

export const getPackageHash = (lockFilePath: string): string => {
    const hashSum = crypto.createHash('md5');

    const packagePath = lockFilePath.replace('yarn.lock', 'package.json');

    let packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    } catch (e) {
        console.error('cant read or parse ' + packagePath);
        throw e;
    }

    let yarnLockContents;
    try {
        yarnLockContents = fs.readFileSync(lockFilePath, 'utf-8');
    } catch (e) {
        console.error('cant read ' + lockFilePath);
        throw e;
    }

    hashSum.update(
        Buffer.from(
            JSON.stringify({
                dependencies: packageJson['dependencies'] || {},
                devDependencies: packageJson['devDependencies'] || {},
                peerDependencies: packageJson['peerDependencies'] || {},
                optionalDependencies: packageJson['optionalDependencies'] || {},
                yarnLockContents: yarnLockContents,
            }),
        ),
    );

    return hashSum.digest('hex');
};
